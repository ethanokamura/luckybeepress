import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:order_items_repository/order_items_repository.dart';

part 'order_items_state.dart';

class OrderItemsCubit extends Cubit<OrderItemsState> {
  OrderItemsCubit({
    required OrderItemsRepository repository,
  })  : _repository = repository,
        super(const OrderItemsState.initial());

  final OrderItemsRepository _repository;

  void setFilters({
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
  }) =>
      emit(state.copyWith(
        sortBy: sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
      ));

  Future<void> createOrderItems({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final orderItems = await _repository.createOrderItems(data: data);

      emit(state.fromOrderItemsLoaded(orderItems: orderItems));
    } on OrderItemsFailure catch (failure) {
      emit(state.fromOrderItemsFailure(failure));
    }
  }

  Future<void> fetchOrderItemsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final orderItems = await _repository.fetchOrderItemsWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromOrderItemsLoaded(orderItems: orderItems));
    } on OrderItemsFailure catch (failure) {
      emit(state.fromOrderItemsFailure(failure));
    }
  }

  Future<void> fetchOrderItemsList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchOrderItemsList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedOrderItemsLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on OrderItemsFailure catch (failure) {
      emit(state.fromOrderItemsFailure(failure));
    }
  }

  Future<void> updateOrderItems({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final orderItems = await _repository.updateOrderItems(
        id: id,
        data: data,
      );
      emit(state.fromOrderItemsLoaded(orderItems: orderItems));
    } on OrderItemsFailure catch (failure) {
      emit(state.fromOrderItemsFailure(failure));
    }
  }

  Future<void> deleteOrderItems({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteOrderItems(id: id);
      emit(state.fromLoaded());
    } on OrderItemsFailure catch (failure) {
      emit(state.fromOrderItemsFailure(failure));
    }
  }
}
