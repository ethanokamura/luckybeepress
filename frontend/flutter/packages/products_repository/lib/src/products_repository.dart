import 'package:api_client/api_client.dart';
import 'models/products.dart';
import 'failures.dart';

/// Repository class for managing Products data with caching and error handling
class ProductsRepository extends BaseRepository<Products> {
  ProductsRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'products';

  @override
  Products fromJson(Map<String, dynamic> json) => Products.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'products',
        'products_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return ProductsFailure.unauthorized();
        case 404:
          return ProductsFailure.notFound();
        case 400:
          return ProductsFailure.validation(
            'Invalid products data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return ProductsFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return ProductsFailure.fromCreate(null, error);
      case 'get':
        return ProductsFailure.fromGet(null, error);
      case 'update':
        return ProductsFailure.fromUpdate(null, error);
      case 'delete':
        return ProductsFailure.fromDelete(null, error);
      default:
        return ProductsFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new products
  Future<Products> createProducts({
    required Map<String, dynamic> data,
  }) async {
    try {
      final products = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(products.id);
      await cacheResponse(cacheKey, products.toJson());

      return products;
    } catch (e) {
      if (e is ProductsFailure) rethrow;
      throw ProductsFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single products by id
  Future<Products> fetchProductsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is ProductsFailure) rethrow;
      throw ProductsFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of products
  Future<PaginatedResponse<Products>> fetchProductsList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Products.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is ProductsFailure) rethrow;
      throw ProductsFailure.fromGet(null, e);
    }
  }

  /// Update a products
  Future<Products> updateProducts({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is ProductsFailure) rethrow;
      throw ProductsFailure.fromUpdate(null, e);
    }
  }

  /// Delete a products
  Future<void> deleteProducts({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is ProductsFailure) rethrow;
      throw ProductsFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific products
  Future<void> invalidateProductsCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a products's data
  Future<Products> refreshProducts(String id) async {
    await invalidateProductsCache(id);
    return fetchProductsWithId(
      id: id,
      forceRefresh: true,
    );
  }

  //////////// Helper Methods ////////////

  int? _extractStatusCode(dynamic error) {
    if (error is Map<String, dynamic>) {
      return error['statusCode'] as int?;
    }
    return null;
  }

  Map<String, dynamic>? _extractErrorDetails(dynamic error) {
    if (error == null) return null;
    if (error is Map<String, dynamic>) return error;
    if (error is String) return {'error': error};
    return {'error': error.toString()};
  }
}
