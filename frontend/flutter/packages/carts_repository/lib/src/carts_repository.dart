import 'package:api_client/api_client.dart';
import 'models/carts.dart';
import 'failures.dart';

/// Repository class for managing Carts data with caching and error handling
class CartsRepository extends BaseRepository<Carts> {
  CartsRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'carts';

  @override
  Carts fromJson(Map<String, dynamic> json) => Carts.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'carts',
        'carts_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return CartsFailure.unauthorized();
        case 404:
          return CartsFailure.notFound();
        case 400:
          return CartsFailure.validation(
            'Invalid carts data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return CartsFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return CartsFailure.fromCreate(null, error);
      case 'get':
        return CartsFailure.fromGet(null, error);
      case 'update':
        return CartsFailure.fromUpdate(null, error);
      case 'delete':
        return CartsFailure.fromDelete(null, error);
      default:
        return CartsFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new carts
  Future<Carts> createCarts({
    required Map<String, dynamic> data,
  }) async {
    try {
      final carts = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(carts.id);
      await cacheResponse(cacheKey, carts.toJson());

      return carts;
    } catch (e) {
      if (e is CartsFailure) rethrow;
      throw CartsFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single carts by id
  Future<Carts> fetchCartsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CartsFailure) rethrow;
      throw CartsFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of carts
  Future<PaginatedResponse<Carts>> fetchCartsList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Carts.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CartsFailure) rethrow;
      throw CartsFailure.fromGet(null, e);
    }
  }

  /// Update a carts
  Future<Carts> updateCarts({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is CartsFailure) rethrow;
      throw CartsFailure.fromUpdate(null, e);
    }
  }

  /// Delete a carts
  Future<void> deleteCarts({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is CartsFailure) rethrow;
      throw CartsFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific carts
  Future<void> invalidateCartsCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a carts's data
  Future<Carts> refreshCarts(String id) async {
    await invalidateCartsCache(id);
    return fetchCartsWithId(
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
