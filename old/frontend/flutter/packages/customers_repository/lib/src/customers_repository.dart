import 'package:api_client/api_client.dart';
import 'models/customers.dart';
import 'failures.dart';

/// Repository class for managing Customers data with caching and error handling
class CustomersRepository extends BaseRepository<Customers> {
  CustomersRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'customers';

  @override
  Customers fromJson(Map<String, dynamic> json) => Customers.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'customers',
        'customers_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return CustomersFailure.unauthorized();
        case 404:
          return CustomersFailure.notFound();
        case 400:
          return CustomersFailure.validation(
            'Invalid customers data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return CustomersFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return CustomersFailure.fromCreate(null, error);
      case 'get':
        return CustomersFailure.fromGet(null, error);
      case 'update':
        return CustomersFailure.fromUpdate(null, error);
      case 'delete':
        return CustomersFailure.fromDelete(null, error);
      default:
        return CustomersFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new customers
  Future<Customers> createCustomers({
    required Map<String, dynamic> data,
  }) async {
    try {
      final customers = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(customers.id);
      await cacheResponse(cacheKey, customers.toJson());

      return customers;
    } catch (e) {
      if (e is CustomersFailure) rethrow;
      throw CustomersFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single customers by id
  Future<Customers> fetchCustomersWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CustomersFailure) rethrow;
      throw CustomersFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of customers
  Future<PaginatedResponse<Customers>> fetchCustomersList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Customers.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is CustomersFailure) rethrow;
      throw CustomersFailure.fromGet(null, e);
    }
  }

  /// Update a customers
  Future<Customers> updateCustomers({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is CustomersFailure) rethrow;
      throw CustomersFailure.fromUpdate(null, e);
    }
  }

  /// Delete a customers
  Future<void> deleteCustomers({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is CustomersFailure) rethrow;
      throw CustomersFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific customers
  Future<void> invalidateCustomersCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a customers's data
  Future<Customers> refreshCustomers(String id) async {
    await invalidateCustomersCache(id);
    return fetchCustomersWithId(
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
