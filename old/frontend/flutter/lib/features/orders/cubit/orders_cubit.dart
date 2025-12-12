import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:orders_repository/orders_repository.dart';

part 'orders_state.dart';

class OrdersCubit extends Cubit<OrdersState> {
  OrdersCubit({
    required OrdersRepository repository,
  })  : _repository = repository,
        super(const OrdersState.initial());

  final OrdersRepository _repository;

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

  Future<void> createOrders({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final orders = await _repository.createOrders(data: data);

      emit(state.fromOrdersLoaded(orders: orders));
    } on OrdersFailure catch (failure) {
      emit(state.fromOrdersFailure(failure));
    }
  }

  Future<void> fetchOrdersWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final orders = await _repository.fetchOrdersWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromOrdersLoaded(orders: orders));
    } on OrdersFailure catch (failure) {
      emit(state.fromOrdersFailure(failure));
    }
  }

  Future<void> fetchOrdersList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchOrdersList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedOrdersLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on OrdersFailure catch (failure) {
      emit(state.fromOrdersFailure(failure));
    }
  }

  Future<void> updateOrders({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final orders = await _repository.updateOrders(
        id: id,
        data: data,
      );
      emit(state.fromOrdersLoaded(orders: orders));
    } on OrdersFailure catch (failure) {
      emit(state.fromOrdersFailure(failure));
    }
  }

  Future<void> deleteOrders({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteOrders(id: id);
      emit(state.fromLoaded());
    } on OrdersFailure catch (failure) {
      emit(state.fromOrdersFailure(failure));
    }
  }
}
