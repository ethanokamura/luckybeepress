import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:carts_repository/carts_repository.dart';

part 'carts_state.dart';

class CartsCubit extends Cubit<CartsState> {
  CartsCubit({
    required CartsRepository repository,
  })  : _repository = repository,
        super(const CartsState.initial());

  final CartsRepository _repository;

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

  Future<void> createCarts({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final carts = await _repository.createCarts(data: data);

      emit(state.fromCartsLoaded(carts: carts));
    } on CartsFailure catch (failure) {
      emit(state.fromCartsFailure(failure));
    }
  }

  Future<void> fetchCartsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final carts = await _repository.fetchCartsWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromCartsLoaded(carts: carts));
    } on CartsFailure catch (failure) {
      emit(state.fromCartsFailure(failure));
    }
  }

  Future<void> fetchCartsList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchCartsList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedCartsLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on CartsFailure catch (failure) {
      emit(state.fromCartsFailure(failure));
    }
  }

  Future<void> updateCarts({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final carts = await _repository.updateCarts(
        id: id,
        data: data,
      );
      emit(state.fromCartsLoaded(carts: carts));
    } on CartsFailure catch (failure) {
      emit(state.fromCartsFailure(failure));
    }
  }

  Future<void> deleteCarts({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteCarts(id: id);
      emit(state.fromLoaded());
    } on CartsFailure catch (failure) {
      emit(state.fromCartsFailure(failure));
    }
  }
}
