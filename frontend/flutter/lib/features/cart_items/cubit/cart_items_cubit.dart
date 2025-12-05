import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:cart_items_repository/cart_items_repository.dart';

part 'cart_items_state.dart';

class CartItemsCubit extends Cubit<CartItemsState> {
  CartItemsCubit({
    required CartItemsRepository repository,
  })  : _repository = repository,
        super(const CartItemsState.initial());

  final CartItemsRepository _repository;

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

  Future<void> createCartItems({
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      data.removeWhere(
        (key, value) => value.toString().isEmpty || value == null,
      );
      final cartItems = await _repository.createCartItems(data: data);

      emit(state.fromCartItemsLoaded(cartItems: cartItems));
    } on CartItemsFailure catch (failure) {
      emit(state.fromCartItemsFailure(failure));
    }
  }

  Future<void> fetchCartItemsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final cartItems = await _repository.fetchCartItemsWithId(
        id: id,
        forceRefresh: forceRefresh,
      );
      emit(state.fromCartItemsLoaded(cartItems: cartItems));
    } on CartItemsFailure catch (failure) {
      emit(state.fromCartItemsFailure(failure));
    }
  }

  Future<void> fetchCartItemsList({
    required int pageNumber,
    bool forceRefresh = false,
  }) async {
    emit(state.fromLoading());
    try {
      final paginatedResult = await _repository.fetchCartItemsList(
        sortBy: state.sortBy,
        ascending: state.ascending,
        limit: state.limit,
        filters: state.filters,
        cursor: forceRefresh ? null : state.cursor,
        forceRefresh: forceRefresh,
      );
      emit(state.fromPaginatedCartItemsLoaded(
        paginatedResult: paginatedResult,
        newPageNumber: pageNumber,
      ));
    } on CartItemsFailure catch (failure) {
      emit(state.fromCartItemsFailure(failure));
    }
  }

  Future<void> updateCartItems({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    emit(state.fromLoading());
    try {
      final cartItems = await _repository.updateCartItems(
        id: id,
        data: data,
      );
      emit(state.fromCartItemsLoaded(cartItems: cartItems));
    } on CartItemsFailure catch (failure) {
      emit(state.fromCartItemsFailure(failure));
    }
  }

  Future<void> deleteCartItems({
    required String id,
  }) async {
    emit(state.fromLoading());
    try {
      await _repository.deleteCartItems(id: id);
      emit(state.fromLoaded());
    } on CartItemsFailure catch (failure) {
      emit(state.fromCartItemsFailure(failure));
    }
  }
}
