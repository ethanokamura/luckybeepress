part of 'products_cubit.dart';

/// Represents the different states a post can be in.
enum ProductsStatus {
  initial,
  loading,
  loaded,
  failure,
}

/// Represents the state of post-related operations.
final class ProductsState extends Equatable {
  /// Private constructor for creating [ProductsState] instances.
  const ProductsState._({
    this.status = ProductsStatus.initial,
    this.products = Products.empty,
    this.productsList = const [],
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

  /// Creates an initial [ProductsState].
  const ProductsState.initial() : this._();

  final ProductsStatus status;
  final Products products;
  final List<Products> productsList;
  final int count;
  final bool hasNextPage;
  final String? cursor;
  final List<String?> pages;
  final int pageNumber;
  final String sortBy;
  final bool ascending;
  final int limit;
  final List<Filter> filters;
  final ProductsFailure? failure;

  // Rebuilds the widget when the props change
  @override
  List<Object?> get props => [
        status,
        products,
        productsList,
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

  /// Creates a new [ProductsState] with updated fields.
  /// Any parameter that is not provided will retain its current value.
  ProductsState copyWith({
    ProductsStatus? status,
    Products? products,
    List<Products>? productsList,
    int? count,
    bool? hasNextPage,
    String? cursor,
    List<String?>? pages,
    int? pageNumber,
    String? sortBy,
    bool? ascending,
    int? limit,
    List<Filter>? filters,
    ProductsFailure? failure,
  }) {
    return ProductsState._(
      status: status ?? this.status,
      products: products ?? this.products,
      count: count ?? this.count,
      cursor: cursor ?? this.cursor,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      pages: pages ?? this.pages,
      pageNumber: pageNumber ?? this.pageNumber,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      limit: limit ?? this.limit,
      filters: filters ?? this.filters,
      productsList: productsList ?? this.productsList,
      failure: failure ?? this.failure,
    );
  }
}

/// Extension methods for convenient state checks.
extension ProductsStateExtensions on ProductsState {
  bool get isLoaded => status == ProductsStatus.loaded;
  bool get isLoading => status == ProductsStatus.loading;
  bool get isFailure => status == ProductsStatus.failure;
}

/// Extension methods for creating new [ProductsState] instances.
extension _ProductsStateExtensions on ProductsState {
  ProductsState fromLoading() => copyWith(status: ProductsStatus.loading);
  ProductsState fromLoaded() => copyWith(status: ProductsStatus.loaded);
  ProductsState fromProductsLoaded({required Products products}) => copyWith(
        status: ProductsStatus.loaded,
        products: products,
      );

  ProductsState fromPaginatedProductsLoaded({
    required PaginatedResponse<Products> paginatedResult,
    required int newPageNumber,
  }) =>
      copyWith(
        status: ProductsStatus.loaded,
        productsList: paginatedResult.data,
        hasNextPage: paginatedResult.hasNextPage,
        cursor: paginatedResult.nextCursor,
        pages: newPageNumber >= pageNumber && newPageNumber >= pages.length - 1
            ? (List.of(pages)..add(paginatedResult.nextCursor))
            : pages,
        pageNumber: newPageNumber,
      );

  ProductsState fromProductsFailure(ProductsFailure failure) => copyWith(
        status: ProductsStatus.failure,
        failure: failure,
      );
}
