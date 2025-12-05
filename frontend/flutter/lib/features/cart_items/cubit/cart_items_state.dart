part of 'cart_items_cubit.dart';

/// Represents the different states a post can be in.
enum CartItemsStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class CartItemsState extends Equatable {
  /// Private constructor for creating [CartItemsState] instances.
  const CartItemsState._({
    this.status = CartItemsStatus.initial,
    this.cartItems = CartItems.empty,
    this.cartItemsList = const [],
    this.count = 0,
    this.hasNextPage = false,
    this.cursor,
    this.pages = const [null],
    this.pageNumber = 0,
    this.sortBy = '',
    this.ascending = false,
    this.filters = const [],
    this.limit = 25,
    this.failure,
  });

  /// Creates an initial [CartItemsState].
  const CartItemsState.initial() : this._();

  final CartItemsStatus status;
  final CartItems cartItems;
  final List<CartItems> cartItemsList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final CartItemsFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        cartItems,
        cartItemsList,
        count,
        hasNextPage,
        cursor,
        pages,
        pageNumber,
        sortBy,
        ascending,
        limit,
        filters,
        failure,
      ];

  /// Creates a new [CartItemsState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  CartItemsState copyWith({
    CartItemsStatus? status,
    CartItems? cartItems,
    List<CartItems>? cartItemsList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    CartItemsFailure? failure,
  }) {
    return CartItemsState._(
      status: status ?? this.status,
      cartItems: cartItems ?? this.cartItems,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      cartItemsList: cartItemsList ?? this.cartItemsList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension CartItemsStateExtensions on CartItemsState {
  bool get isLoaded => status == CartItemsStatus.loaded;
  bool get isLoading => status == CartItemsStatus.loading;
  bool get isFailure => status == CartItemsStatus.failure;
}

/// Extension methods for creating new [CartItemsState] instances.
extension _CartItemsStateExtensions on CartItemsState {
  CartItemsState fromLoading() => copyWith(status: CartItemsStatus.loading);
  CartItemsState fromLoaded() => copyWith(status: CartItemsStatus.loaded);
  CartItemsState fromCartItemsLoaded({required CartItems cartItems}) =>
      copyWith(
        status: CartItemsStatus.loaded,
        cartItems: cartItems,
      );

  CartItemsState fromPaginatedCartItemsLoaded({
    required PaginatedResponse<CartItems> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: CartItemsStatus.loaded,
        cartItemsList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  CartItemsState fromCartItemsFailure(CartItemsFailure failure) => copyWith(
        status: CartItemsStatus.failure,
        failure: failure,
      );
}
