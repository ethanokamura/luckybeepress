import 'dart:convert';
import 'package:flutter/foundation.dart' show debugPrint, protected;

import '../cache/cache_manager.dart';
import '../requests/requests.dart';

/// An abstract base class providing common data access operations (CRUD)
/// and caching mechanisms for a specific entity type [T].
///
/// This class is designed to be extended by concrete repository classes
/// that manage data for a single entity (e.g., `UserRepository`, `ProductRepository`).
abstract class BaseRepository<T> {
  /// Initializes the repository with a required [CacheManager].
  BaseRepository(this._cacheManager);

  /// The cache manager used for storing and retrieving network responses.
  final CacheManager _cacheManager;

  /// The API client used for making network requests.
  final ApiClient _apiClient = ApiClient();

  // Abstract methods that child classes must implement

  /// The base endpoint name for this entity (e.g., 'users', 'products').
  String get entityName;

  /// A factory method to convert a JSON [Map] into an instance of type [T].
  T fromJson(Map<String, dynamic> json);

  /// Generates a unique cache key string for an entity with the given [id].
  String getCacheKeyForId(String id);

  /// Creates a specific [Exception] instance to represent a failure
  /// during a data [operation] (e.g., 'get', 'create').
  Exception createFailure(String operation, {dynamic error});

  /// Makes a low-level network request using the internal [ApiClient].
  ///
  /// This method handles serialization of the response into an [ApiResponse<T>]
  /// using the concrete implementation of [fromJson].
  ///
  /// @param method The HTTP method (e.g., 'GET', 'POST').
  /// @param endpoint The API endpoint path.
  /// @param payload The request body data for POST/PATCH methods.
  /// @returns A [Future] that resolves to an [ApiResponse<T>].
  Future<ApiResponse<T>> makeRequest({
    required String method,
    required String endpoint,
    Map<String, dynamic>? payload,
  }) async {
    return _apiClient.request<T>(
      method: method,
      endpoint: endpoint,
      payload: payload,
      fromJson: (json) => fromJson(json as Map<String, dynamic>),
    );
  }

  /// Makes a low-level network request using the internal [ApiClient].
  ///
  /// This method handles serialization of the response into an [PaginatedResponse<T>]
  /// using the concrete implementation of [fromJson].
  ///
  /// @param method The HTTP method (e.g., 'GET', 'POST').
  /// @param endpoint The API endpoint path.
  /// @returns A [Future] that resolves to an [PaginatedResponse<T>].
  Future<PaginatedResponse<T>> makePaginatedRequest({
    required String method,
    required String endpoint,
    Map<String, dynamic>? payload,
  }) async {
    return _apiClient.paginatedRequest<T>(
      method: method,
      endpoint: endpoint,
      fromJson: (json) => fromJson(json as Map<String, dynamic>),
    );
  }

  // Common fetch single operation

  /// Fetches a single entity of type [T] by its unique [id].
  ///
  /// Attempts to retrieve data from the cache first unless [forceRefresh] is true.
  /// If data is not in the cache or caching fails, it fetches from the API.
  ///
  /// @param id The unique identifier of the entity.
  /// @param forceRefresh If true, skips the cache and fetches from the API.
  /// @returns A [Future] that resolves to the entity [T].
  /// @throws An [Exception] created by [createFailure] on API or decoding error.
  Future<T> fetchById({
    required String id,
    bool forceRefresh = false,
  }) async {
    final cacheKey = getCacheKeyForId(id);

    if (!forceRefresh) {
      final cachedData = await getCachedData(cacheKey);
      if (cachedData != null) {
        try {
          return fromJson(cachedData);
        } catch (e) {
          // Cache corrupted, continue to fetch from API
          await _cacheManager.deleteCachedHttpResponse(cacheKey);
        }
      }
    }

    try {
      final response = await makeRequest(
        endpoint: '$entityName/$id',
        method: 'GET',
      );

      if (!response.success || response.data == null) {
        throw createFailure('get', error: response.error);
      }
      await cacheResponse(cacheKey, response.data);

      return response.data!;
    } catch (e) {
      debugPrint(e.toString());
      if (e is Exception) rethrow;
      throw createFailure('get', error: e);
    }
  }

  // Common fetch list operation

  /// Fetches a paginated list of entities of type [T].
  ///
  /// Supports sorting, filtering, limiting, and cursor-based pagination.
  /// Attempts to retrieve data from the cache first unless [forceRefresh] is true.
  ///
  /// @param sortBy The field name to sort the list by.
  /// @param ascending The sort direction.
  /// @param limit The maximum number of results to return (defaults to 25).
  /// @param filters A list of filters to apply to the query.
  /// @param cursor An optional cursor for pagination.
  /// @param forceRefresh If true, skips the cache and fetches from the API.
  /// @param customEndpoint An optional custom endpoint to use instead of [entityName].
  /// @returns A [Future] that resolves to a [PaginatedResponse<T>].
  /// @throws An [Exception] created by [createFailure] on API or decoding error.
  Future<PaginatedResponse<T>> fetchList({
    required String sortBy,
    required bool ascending,
    int limit = 25,
    List<Filter> filters = const [],
    String? cursor,
    bool forceRefresh = false,
    String? customEndpoint,
  }) async {
    final endpoint = EndpointBuilder(
      baseEndpoint: customEndpoint ?? entityName,
      sortBy: sortBy,
      ascending: ascending,
      cursor: cursor,
      filters: filters,
      limit: limit,
    ).build();

    if (!forceRefresh) {
      final cachedData = await getCachedData(endpoint);
      if (cachedData != null) {
        try {
          return PaginatedResponse.fromJson(
            cachedData,
            (json) => fromJson(json as Map<String, dynamic>),
          );
        } catch (e) {
          // Cache corrupted, continue to fetch from API
          await _cacheManager.deleteCachedHttpResponse(endpoint);
        }
      }
    }

    try {
      final response = await makePaginatedRequest(
        endpoint: endpoint,
        method: 'GET',
      );

      if (!response.success) {
        throw createFailure('get', error: response);
      }

      await cacheResponse(endpoint, {
        'data': response.data,
        'nextCursor': response.nextCursor,
        'hasNextPage': response.hasNextPage,
      });

      return response;
    } catch (e) {
      if (e is Exception) rethrow;
      throw createFailure('get', error: e);
    }
  }

  // Common create operation

  /// Creates a new entity of type [T] by sending [data] to the API.
  ///
  /// @param data The JSON data to send in the request body.
  /// @param cacheKey An optional cache key to use for storing the newly created entity.
  /// @returns A [Future] that resolves to the newly created entity [T].
  /// @throws An [Exception] created by [createFailure] on API or decoding error.
  Future<T> create({
    required Map<String, dynamic> data,
    String? cacheKey,
  }) async {
    try {
      final response = await makeRequest(
        endpoint: entityName,
        method: 'POST',
        payload: data,
      );

      if (!response.success || response.data == null) {
        throw createFailure('create', error: response.error);
      }

      if (cacheKey != null) {
        await cacheResponse(cacheKey, response.data);
      }

      return response.data!;
    } catch (e) {
      if (e is Exception) rethrow;
      throw createFailure('create', error: e);
    }
  }

  // Common update operation

  /// Updates an existing entity specified by [id] with the given [data].
  ///
  /// The updated entity is then cached.
  ///
  /// @param id The unique identifier of the entity to update.
  /// @param data The JSON data containing fields to update.
  /// @returns A [Future] that resolves to the updated entity [T].
  /// @throws An [Exception] created by [createFailure] on API or decoding error.
  Future<T> update({
    required String id,
    required Map<String, dynamic> data,
  }) async {
    final cacheKey = getCacheKeyForId(id);

    try {
      final response = await makeRequest(
        endpoint: '$entityName/$id',
        method: 'PATCH',
        payload: data,
      );

      if (!response.success || response.data == null) {
        throw createFailure('update', error: response.error);
      }

      await cacheResponse(cacheKey, response.data);
      return response.data!;
    } catch (e) {
      if (e is Exception) rethrow;
      throw createFailure('update', error: e);
    }
  }

  // Common delete operation

  /// Deletes an entity specified by [id] from the API and invalidates its cache.
  ///
  /// @param id The unique identifier of the entity to delete.
  /// @returns A [Future] that completes when the deletion is successful.
  /// @throws An [Exception] created by [createFailure] on API error.
  Future<void> delete({required String id}) async {
    final cacheKey = getCacheKeyForId(id);

    try {
      final response = await makeRequest(
        endpoint: '$entityName/$id',
        method: 'DELETE',
      );

      if (!response.success) {
        throw createFailure('delete', error: response.error);
      }

      await _cacheManager.deleteCachedHttpResponse(cacheKey);
    } catch (e) {
      if (e is Exception) rethrow;
      throw createFailure('delete', error: e);
    }
  }

  /// Protected: Cache a successful API response. Available to child classes.
  ///
  /// Handles potential caching errors gracefully by logging them.
  ///
  /// @param key The cache key to use.
  /// @param data The data (usually a Map) to be JSON-encoded and stored.
  @protected
  Future<void> cacheResponse(String key, dynamic data) async {
    try {
      await _cacheManager.cacheHttpResponse(
        key: key,
        responseBody: jsonEncode(data),
      );
    } catch (e) {
      // Log cache error but don't throw - caching is not critical
      debugPrint('Cache write error: $e');
    }
  }

  /// Protected: Retrieves cached data by [key]. Available to child classes.
  ///
  /// Handles potential caching and decoding errors gracefully by returning `null`.
  ///
  /// @param key The cache key to look up.
  /// @returns A [Future] that resolves to the cached JSON [Map] or `null` if not found or corrupted.
  @protected
  Future<Map<String, dynamic>?> getCachedData(String key) async {
    try {
      final cachedData = await _cacheManager.getCachedHttpResponse(key);
      if (cachedData != null) {
        return jsonDecode(cachedData) as Map<String, dynamic>;
      }
    } catch (e) {
      // Log cache error but return null - will fetch from API
      debugPrint('Cache read error: $e');
    }
    return null;
  }

  /// Invalidate cache for a specific entity ID.
  ///
  /// Deletes the cached response associated with the given [id].
  Future<void> invalidateCache(String id) async {
    final cacheKey = getCacheKeyForId(id);
    await _cacheManager.deleteCachedHttpResponse(cacheKey);
  }

  /// Invalidate all cache entries associated with this entity.
  ///
  /// *Note: The actual implementation depends on the specific [CacheManager] implementation.*
  Future<void> invalidateAllCache() async {
    // Implementation depends on your cache manager
    debugPrint('Invalidating all cache for $entityName');
  }
}
