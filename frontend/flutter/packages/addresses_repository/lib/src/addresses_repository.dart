import 'package:api_client/api_client.dart';
import 'models/addresses.dart';
import 'failures.dart';

/// Repository class for managing Addresses data with caching and error handling
class AddressesRepository extends BaseRepository<Addresses> {
  AddressesRepository() : super(GetIt.instance<CacheManager>());

  @override
  String get entityName => 'addresses';

  @override
  Addresses fromJson(Map<String, dynamic> json) => Addresses.fromJson(json);

  @override
  String getCacheKeyForId(String id) => generateCacheKey({
        'object': 'addresses',
        'addresses_id': id,
      });

  @override
  Exception createFailure(String operation, {dynamic error}) {
    // Map status codes to specific failure types
    final statusCode = _extractStatusCode(error);

    if (statusCode != null) {
      switch (statusCode) {
        case 401:
          return AddressesFailure.unauthorized();
        case 404:
          return AddressesFailure.notFound();
        case 400:
          return AddressesFailure.validation(
            'Invalid addresses data',
            _extractErrorDetails(error),
          );
        case >= 500:
          return AddressesFailure(
            message: 'Server error occurred',
            type: FailureType.serverError,
            statusCode: statusCode,
          );
      }
    }

    // Default failures based on operation
    switch (operation) {
      case 'create':
        return AddressesFailure.fromCreate(null, error);
      case 'get':
        return AddressesFailure.fromGet(null, error);
      case 'update':
        return AddressesFailure.fromUpdate(null, error);
      case 'delete':
        return AddressesFailure.fromDelete(null, error);
      default:
        return AddressesFailure.fromGet(null, error);
    }
  }

  //////////// CRUD Operations ////////////

  /// Create a new addresses
  Future<Addresses> createAddresses({
    required Map<String, dynamic> data,
  }) async {
    try {
      final addresses = await create(data: data);

      // Cache with the proper key after creation
      final cacheKey = getCacheKeyForId(addresses.id);
      await cacheResponse(cacheKey, addresses.toJson());

      return addresses;
    } catch (e) {
      if (e is AddressesFailure) rethrow;
      throw AddressesFailure.fromCreate(null, e);
    }
  }

  /// Fetch a single addresses by id
  Future<Addresses> fetchAddressesWithId({
    required String id,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchById(
        id: id,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is AddressesFailure) rethrow;
      throw AddressesFailure.fromGet(null, e);
    }
  }

  /// Fetch a paginated list of addresses
  Future<PaginatedResponse<Addresses>> fetchAddressesList({
    String sortBy = '',
    bool ascending = false,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
  }) async {
    try {
      return await fetchList(
        sortBy: sortBy.isEmpty ? Addresses.createdAtConverter : sortBy,
        ascending: ascending,
        limit: limit,
        filters: filters,
        cursor: cursor,
        forceRefresh: forceRefresh,
      );
    } catch (e) {
      if (e is AddressesFailure) rethrow;
      throw AddressesFailure.fromGet(null, e);
    }
  }

  /// Update a addresses
  Future<Addresses> updateAddresses({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    try {
      return await update(
        id: id,
        data: data,
      );
    } catch (e) {
      if (e is AddressesFailure) rethrow;
      throw AddressesFailure.fromUpdate(null, e);
    }
  }

  /// Delete a addresses
  Future<void> deleteAddresses({
    required String id,
  }) async {
    try {
      await delete(id: id);
    } catch (e) {
      if (e is AddressesFailure) rethrow;
      throw AddressesFailure.fromDelete(null, e);
    }
  }

  //////////// Cache Management ////////////

  /// Invalidate cache for a specific addresses
  Future<void> invalidateAddressesCache(String id) async {
    await invalidateCache(id);
  }

  /// Refresh a addresses's data
  Future<Addresses> refreshAddresses(String id) async {
    await invalidateAddressesCache(id);
    return fetchAddressesWithId(
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
