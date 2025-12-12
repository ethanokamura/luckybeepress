import 'package:api_client/api_client.dart';
import 'models/cart_items.dart';
import 'failures.dart';

/// Repository class for managing CartItems data with caching and error handling
class CartItemsRepository extends BaseRepository<CartItems> {
  CartItemsRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'cart-items';

  @override
  CartItems fromJson(Map<String, dynamic> json) => CartItems.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'cart-items',
        'cart_items_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return CartItemsFailure.unauthorized();
        case 404:
          return CartItemsFailure.notFound();
        case 400:
          return CartItemsFailure.validation(
            'Invalid cart items data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return CartItemsFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return CartItemsFailure.fromCreate(null, error);
      case 'get':
        return CartItemsFailure.fromGet(null, error);
      case 'update':
        return CartItemsFailure.fromUpdate(null, error);
      case 'delete':
        return CartItemsFailure.fromDelete(null, error);
      default:
        return CartItemsFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new cart items
  Future<CartItems> createCartItems({
    required Map<String, dynamic> data,
  }) async {
    try {
      final cartItems = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(cartItems.id);
      await cacheResponse(cacheKey, cartItems.toJson());

      return cartItems;
    } catch (e) {
      if (e is CartItemsFailure) rethrow;
      throw CartItemsFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single cart items by id
  Future<CartItems> fetchCartItemsWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CartItemsFailure) rethrow;
      throw CartItemsFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of cart items
  Future<PaginatedResponse<CartItems>> fetchCartItemsList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? CartItems.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CartItemsFailure) rethrow;
      throw CartItemsFailure.fromGet(null, e);
    }
  }

  /// Update a cart items
  Future<CartItems> updateCartItems({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is CartItemsFailure) rethrow;
      throw CartItemsFailure.fromUpdate(null, e);
    }
  }

  /// Delete a cart items
  Future<void> deleteCartItems({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is CartItemsFailure) rethrow;
      throw CartItemsFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific cart items
  Future<void> invalidateCartItemsCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a cart items's data
  Future<CartItems> refreshCartItems(String id) async {
    await invalidateCartItemsCache(id);
    return fetchCartItemsWithId(
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
