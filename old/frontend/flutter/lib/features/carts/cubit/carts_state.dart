part of 'carts_cubit.dart';

/// Represents the different states a post can be in.
enum CartsStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class CartsState extends Equatable {
  /// Private constructor for creating [CartsState] instances.
  const CartsState._({
    this.status = CartsStatus.initial,
    this.carts = Carts.empty,
    this.cartsList = const [],
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

  /// Creates an initial [CartsState].
  const CartsState.initial() : this._();

  final CartsStatus status;
  final Carts carts;
  final List<Carts> cartsList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final CartsFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        carts,
        cartsList,
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

  /// Creates a new [CartsState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  CartsState copyWith({
    CartsStatus? status,
    Carts? carts,
    List<Carts>? cartsList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    CartsFailure? failure,
  }) {
    return CartsState._(
      status: status ?? this.status,
      carts: carts ?? this.carts,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      cartsList: cartsList ?? this.cartsList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension CartsStateExtensions on CartsState {
  bool get isLoaded => status == CartsStatus.loaded;
  bool get isLoading => status == CartsStatus.loading;
  bool get isFailure => status == CartsStatus.failure;
}

/// Extension methods for creating new [CartsState] instances.
extension _CartsStateExtensions on CartsState {
  CartsState fromLoading() => copyWith(status: CartsStatus.loading);
  CartsState fromLoaded() => copyWith(status: CartsStatus.loaded);
  CartsState fromCartsLoaded({required Carts carts}) => copyWith(
        status: CartsStatus.loaded,
        carts: carts,
      );

  CartsState fromPaginatedCartsLoaded({
    required PaginatedResponse<Carts> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: CartsStatus.loaded,
        cartsList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  CartsState fromCartsFailure(CartsFailure failure) => copyWith(
        status: CartsStatus.failure,
        failure: failure,
      );
}
