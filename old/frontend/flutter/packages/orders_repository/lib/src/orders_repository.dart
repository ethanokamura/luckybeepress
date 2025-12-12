import 'package:api_client/api_client.dart';
import 'models/orders.dart';
import 'failures.dart';

/// Repository class for managing Orders data with caching and error handling
class OrdersRepository extends BaseRepository<Orders> {
  OrdersRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'orders';

  @override
  Orders fromJson(Map<String, dynamic> json) => Orders.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'orders',
        'orders_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return OrdersFailure.unauthorized();
        case 404:
          return OrdersFailure.notFound();
        case 400:
          return OrdersFailure.validation(
            'Invalid orders data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return OrdersFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return OrdersFailure.fromCreate(null, error);
      case 'get':
        return OrdersFailure.fromGet(null, error);
      case 'update':
        return OrdersFailure.fromUpdate(null, error);
      case 'delete':
        return OrdersFailure.fromDelete(null, error);
      default:
        return OrdersFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new orders
  Future<Orders> createOrders({
    required Map<String, dynamic> data,
  }) async {
    try {
      final orders = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(orders.id);
      await cacheResponse(cacheKey, orders.toJson());

      return orders;
    } catch (e) {
      if (e is OrdersFailure) rethrow;
      throw OrdersFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single orders by id
  Future<Orders> fetchOrdersWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is OrdersFailure) rethrow;
      throw OrdersFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of orders
  Future<PaginatedResponse<Orders>> fetchOrdersList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Orders.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is OrdersFailure) rethrow;
      throw OrdersFailure.fromGet(null, e);
    }
  }

  /// Update a orders
  Future<Orders> updateOrders({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is OrdersFailure) rethrow;
      throw OrdersFailure.fromUpdate(null, e);
    }
  }

  /// Delete a orders
  Future<void> deleteOrders({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is OrdersFailure) rethrow;
      throw OrdersFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific orders
  Future<void> invalidateOrdersCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a orders's data
  Future<Orders> refreshOrders(String id) async {
    await invalidateOrdersCache(id);
    return fetchOrdersWithId(
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
