part of 'orders_cubit.dart';

/// Represents the different states a post can be in.
enum OrdersStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class OrdersState extends Equatable {
  /// Private constructor for creating [OrdersState] instances.
  const OrdersState._({
    this.status = OrdersStatus.initial,
    this.orders = Orders.empty,
    this.ordersList = const [],
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

  /// Creates an initial [OrdersState].
  const OrdersState.initial() : this._();

  final OrdersStatus status;
  final Orders orders;
  final List<Orders> ordersList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final OrdersFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        orders,
        ordersList,
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

  /// Creates a new [OrdersState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  OrdersState copyWith({
    OrdersStatus? status,
    Orders? orders,
    List<Orders>? ordersList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    OrdersFailure? failure,
  }) {
    return OrdersState._(
      status: status ?? this.status,
      orders: orders ?? this.orders,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      ordersList: ordersList ?? this.ordersList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension OrdersStateExtensions on OrdersState {
  bool get isLoaded => status == OrdersStatus.loaded;
  bool get isLoading => status == OrdersStatus.loading;
  bool get isFailure => status == OrdersStatus.failure;
}

/// Extension methods for creating new [OrdersState] instances.
extension _OrdersStateExtensions on OrdersState {
  OrdersState fromLoading() => copyWith(status: OrdersStatus.loading);
  OrdersState fromLoaded() => copyWith(status: OrdersStatus.loaded);
  OrdersState fromOrdersLoaded({required Orders orders}) => copyWith(
        status: OrdersStatus.loaded,
        orders: orders,
      );

  OrdersState fromPaginatedOrdersLoaded({
    required PaginatedResponse<Orders> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: OrdersStatus.loaded,
        ordersList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  OrdersState fromOrdersFailure(OrdersFailure failure) => copyWith(
        status: OrdersStatus.failure,
        failure: failure,
      );
}
