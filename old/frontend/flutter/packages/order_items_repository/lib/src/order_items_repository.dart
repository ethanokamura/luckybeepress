import 'package:api_client/api_client.dart';
import 'models/order_items.dart';
import 'failures.dart';

/// Repository class for managing OrderItems data with caching and error handling
class OrderItemsRepository extends BaseRepository<OrderItems> {
  OrderItemsRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'order-items';

  @override
  OrderItems fromJson(Map<String, dynamic> json) => OrderItems.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'order-items',
        'order_items_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return OrderItemsFailure.unauthorized();
        case 404:
          return OrderItemsFailure.notFound();
        case 400:
          return OrderItemsFailure.validation(
            'Invalid order items data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return OrderItemsFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return OrderItemsFailure.fromCreate(null, error);
      case 'get':
        return OrderItemsFailure.fromGet(null, error);
      case 'update':
        return OrderItemsFailure.fromUpdate(null, error);
      case 'delete':
        return OrderItemsFailure.fromDelete(null, error);
      default:
        return OrderItemsFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new order items
  Future<OrderItems> createOrderItems({
    required Map<String, dynamic> data,
  }) async {
    try {
      final orderItems = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(orderItems.id);
      await cacheResponse(cacheKey, orderItems.toJson());

      return orderItems;
    } catch (e) {
      if (e is OrderItemsFailure) rethrow;
      throw OrderItemsFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single order items by id
  Future<OrderItems> fetchOrderItemsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is OrderItemsFailure) rethrow;
      throw OrderItemsFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of order items
  Future<PaginatedResponse<OrderItems>> fetchOrderItemsList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? OrderItems.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is OrderItemsFailure) rethrow;
      throw OrderItemsFailure.fromGet(null, e);
    }
  }

  /// Update a order items
  Future<OrderItems> updateOrderItems({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is OrderItemsFailure) rethrow;
      throw OrderItemsFailure.fromUpdate(null, e);
    }
  }

  /// Delete a order items
  Future<void> deleteOrderItems({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is OrderItemsFailure) rethrow;
      throw OrderItemsFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific order items
  Future<void> invalidateOrderItemsCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a order items's data
  Future<OrderItems> refreshOrderItems(String id) async {
    await invalidateOrderItemsCache(id);
    return fetchOrderItemsWithId(
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
