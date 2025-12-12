import 'package:api_client/api_client.dart';
import 'package:credentials_repository/credentials_repository.dart';

/// HTTP interceptor that handles authentication and automatic token refresh
class AuthInterceptor extends Interceptor {
  AuthInterceptor({
    required this.credentialsRepository,
    required this.onSignOut,
  });

  final CredentialsRepository credentialsRepository;
  final Future<void> Function() onSignOut;

  // Track ongoing refresh to prevent multiple simultaneous refresh attempts
  Future<void>? _refreshFuture;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      // Skip auth for certain endpoints (login, public endpoints, etc.)
      if (_shouldSkipAuth(options.path)) {
        handler.next(options);
        return;
      }

      // Get valid access token (this will refresh if needed)
      await credentialsRepository.verifyAuthentication();
      String? accessToken = await credentialsRepository.getValidAccessToken();

      // Add token to headers
      if (accessToken != null) {
        options.headers['Authorization'] = 'Bearer $accessToken';
      }
      handler.next(options);
    } catch (e) {
      handler.reject(
        DioException(
          requestOptions: options,
          error: 'Authentication failed',
          type: DioExceptionType.cancel,
        ),
      );
    }
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final response = err.response;

    // Handle 401 Unauthorized responses
    if (response?.statusCode == 401) {
      try {
        // Prevent multiple simultaneous refresh attempts
        _refreshFuture ??= _handleTokenRefresh();
        await _refreshFuture;
        _refreshFuture = null;

        // Clone the original request
        final RequestOptions requestOptions = response!.requestOptions;

        String? accessToken;

        // Get valid access token (this will refresh if needed)
        try {
          accessToken = await credentialsRepository.getValidAccessToken();
        } on TokenFailure {
          await onSignOut();
        }
        if (accessToken == null) throw CredentialsFailure.fromAuthChanges();

        // Update the authorization header
        requestOptions.headers['Authorization'] = 'Bearer $accessToken';

        // Retry the original request
        final dio = GetIt.instance<Dio>();
        final clonedResponse = await dio.fetch(requestOptions);

        // Return the successful response
        handler.resolve(clonedResponse);
        return;
      } catch (refreshError) {
        // Clear credentials and notify app
        await credentialsRepository.logout();

        // Let the original 401 error propagate
        handler.next(err);
        return;
      }
    }

    // Handle other types of errors normally
    handler.next(err);
  }

  /// Handles the token refresh process
  Future<void> _handleTokenRefresh() async {
    try {
      // Force refresh tokens
      await credentialsRepository.getValidAccessToken();
    } catch (e) {
      rethrow;
    }
  }

  /// Determines if authentication should be skipped for certain endpoints
  bool _shouldSkipAuth(String path) {
    final skipPaths = [
      // Add public endpoints here
    ];

    return skipPaths.any((skipPath) => path.contains(skipPath));
  }
}
