part of 'order_items_cubit.dart';

/// Represents the different states a post can be in.
enum OrderItemsStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class OrderItemsState extends Equatable {
  /// Private constructor for creating [OrderItemsState] instances.
  const OrderItemsState._({
    this.status = OrderItemsStatus.initial,
    this.orderItems = OrderItems.empty,
    this.orderItemsList = const [],
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

  /// Creates an initial [OrderItemsState].
  const OrderItemsState.initial() : this._();

  final OrderItemsStatus status;
  final OrderItems orderItems;
  final List<OrderItems> orderItemsList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final OrderItemsFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        orderItems,
        orderItemsList,
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

  /// Creates a new [OrderItemsState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  OrderItemsState copyWith({
    OrderItemsStatus? status,
    OrderItems? orderItems,
    List<OrderItems>? orderItemsList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    OrderItemsFailure? failure,
  }) {
    return OrderItemsState._(
      status: status ?? this.status,
      orderItems: orderItems ?? this.orderItems,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      orderItemsList: orderItemsList ?? this.orderItemsList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension OrderItemsStateExtensions on OrderItemsState {
  bool get isLoaded => status == OrderItemsStatus.loaded;
  bool get isLoading => status == OrderItemsStatus.loading;
  bool get isFailure => status == OrderItemsStatus.failure;
}

/// Extension methods for creating new [OrderItemsState] instances.
extension _OrderItemsStateExtensions on OrderItemsState {
  OrderItemsState fromLoading() => copyWith(status: OrderItemsStatus.loading);
  OrderItemsState fromLoaded() => copyWith(status: OrderItemsStatus.loaded);
  OrderItemsState fromOrderItemsLoaded({required OrderItems orderItems}) =>
      copyWith(
        status: OrderItemsStatus.loaded,
        orderItems: orderItems,
      );

  OrderItemsState fromPaginatedOrderItemsLoaded({
    required PaginatedResponse<OrderItems> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: OrderItemsStatus.loaded,
        orderItemsList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  OrderItemsState fromOrderItemsFailure(OrderItemsFailure failure) => copyWith(
        status: OrderItemsStatus.failure,
        failure: failure,
      );
}
