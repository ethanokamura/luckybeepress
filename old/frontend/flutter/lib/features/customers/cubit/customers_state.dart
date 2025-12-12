part of 'customers_cubit.dart';

/// Represents the different states a post can be in.
enum CustomersStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class CustomersState extends Equatable {
  /// Private constructor for creating [CustomersState] instances.
  const CustomersState._({
    this.status = CustomersStatus.initial,
    this.customers = Customers.empty,
    this.customersList = const [],
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

  /// Creates an initial [CustomersState].
  const CustomersState.initial() : this._();

  final CustomersStatus status;
  final Customers customers;
  final List<Customers> customersList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final CustomersFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        customers,
        customersList,
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

  /// Creates a new [CustomersState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  CustomersState copyWith({
    CustomersStatus? status,
    Customers? customers,
    List<Customers>? customersList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    CustomersFailure? failure,
  }) {
    return CustomersState._(
      status: status ?? this.status,
      customers: customers ?? this.customers,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      customersList: customersList ?? this.customersList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension CustomersStateExtensions on CustomersState {
  bool get isLoaded => status == CustomersStatus.loaded;
  bool get isLoading => status == CustomersStatus.loading;
  bool get isFailure => status == CustomersStatus.failure;
}

/// Extension methods for creating new [CustomersState] instances.
extension _CustomersStateExtensions on CustomersState {
  CustomersState fromLoading() => copyWith(status: CustomersStatus.loading);
  CustomersState fromLoaded() => copyWith(status: CustomersStatus.loaded);
  CustomersState fromCustomersLoaded({required Customers customers}) =>
      copyWith(
        status: CustomersStatus.loaded,
        customers: customers,
      );

  CustomersState fromPaginatedCustomersLoaded({
    required PaginatedResponse<Customers> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: CustomersStatus.loaded,
        customersList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  CustomersState fromCustomersFailure(CustomersFailure failure) => copyWith(
        status: CustomersStatus.failure,
        failure: failure,
      );
}
