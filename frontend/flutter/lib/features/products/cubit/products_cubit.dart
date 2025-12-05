import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:products_repository/products_repository.dart';

part 'products_state.dart';

class ProductsCubit extends Cubit<ProductsState> {
  ProductsCubit({
    required ProductsRepository repository,
  })  : _repository = repository,
        super(const ProductsState.initial());

  final ProductsRepository _repository;

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

  Future<void> createProducts({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final products = await _repository.createProducts(data: data);

      emit(state.fromProductsLoaded(products: products));
    } on ProductsFailure catch (failure) {
      emit(state.fromProductsFailure(failure));
    }
  }

  Future<void> fetchProductsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final products = await _repository.fetchProductsWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromProductsLoaded(products: products));
    } on ProductsFailure catch (failure) {
      emit(state.fromProductsFailure(failure));
    }
  }

  Future<void> fetchProductsList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchProductsList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedProductsLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on ProductsFailure catch (failure) {
      emit(state.fromProductsFailure(failure));
    }
  }

  Future<void> updateProducts({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final products = await _repository.updateProducts(
        id: id,
        data: data,
      );
      emit(state.fromProductsLoaded(products: products));
    } on ProductsFailure catch (failure) {
      emit(state.fromProductsFailure(failure));
    }
  }

  Future<void> deleteProducts({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteProducts(id: id);
      emit(state.fromLoaded());
    } on ProductsFailure catch (failure) {
      emit(state.fromProductsFailure(failure));
    }
  }
}
