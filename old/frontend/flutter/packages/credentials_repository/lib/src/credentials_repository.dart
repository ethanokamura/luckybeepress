import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'failures.dart';

/// Repository class for managing CredentialsRepository methods and data
class CredentialsRepository with CacheMixin {
  CredentialsRepository()
      : _cacheManager = GetIt.instance<CacheManager>(),
        _auth0 = GetIt.instance<Auth0>();

  final CacheManager _cacheManager;
  final Auth0 _auth0;
  UserProfile? _currentUser;
  @override
  CacheManager get cacheManager => _cacheManager;
  UserProfile? get currentUser => _currentUser;
  bool get authenticated => _currentUser != null;

  late Credentials _credentials;
  Credentials get credentials => _credentials;

  Future<void> verifyAuthentication() async {
    final cachedData =
        await getCached<Credentials>('user-credentials', Credentials.fromMap);
    if (cachedData != null) {
      _credentials = cachedData;
      _currentUser = cachedData.user;
    }
  }

  /// Get a valid ID token, refreshing if necessary
  Future<String?> getValidAccessToken() async {
    final currentUser = _currentUser;
    if (currentUser == null) return null;

    try {
      // Get token without forcing refresh
      if (_credentials.refreshToken != null) {
        _credentials = await _auth0.api
            .renewCredentials(refreshToken: credentials.refreshToken!);
      }
      return _credentials.accessToken;
    } catch (e) {
      throw CredentialsFailure.fromTokenFailure();
    }
  }

  Future<void> login() async {
    try {
      final credentials = await _auth0.webAuthentication().login(
            audience: ApiConfig.auth0Audience,
          ); // useHTTPS: true

      _credentials = credentials;
      _currentUser = credentials.user;
      await cacheResponse('user-credentials', credentials.toMap());
    } catch (e) {
      throw CredentialsFailure.fromSignIn();
    }
  }

  /// Signs out the user from both Google and Firebase.
  Future<void> logout() async {
    try {
      await _auth0
          .webAuthentication()
          // Use a Universal Link logout URL on iOS 17.4+ / macOS 14.4+
          // useHTTPS is ignored on Android
          .logout(useHTTPS: true);
      await clearCredentials();
    } on Exception catch (_) {
      await clearCredentials();
      throw CredentialsFailure.fromSignOut();
    }
  }

  Future<void> clearCredentials() async {
    await _cacheManager.clearAllData();
    _currentUser = null;
  }
}
