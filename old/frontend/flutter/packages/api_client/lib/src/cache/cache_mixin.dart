import 'dart:convert';

import 'cache_manager.dart';

mixin CacheMixin {
  // Classes using this mixin MUST provide a cacheManager
  CacheManager get cacheManager;

  Future<void> cacheResponse(String key, dynamic data) async {
    await cacheManager.cacheHttpResponse(
      key: key,
      responseBody: jsonEncode(data),
    );
  }

  Future<T?> getCached<T>(
    String key,
    T Function(Map<String, dynamic>) fromJson,
  ) async {
    final cachedData = await cacheManager.getCachedHttpResponse(key);
    if (cachedData != null) {
      try {
        final json = jsonDecode(cachedData);
        return fromJson(json);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
