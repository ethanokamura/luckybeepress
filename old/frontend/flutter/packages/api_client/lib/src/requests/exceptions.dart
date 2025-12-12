// exceptions.dart
enum ApiExceptionType {
  network,
  timeout,
  server,
  client,
  validation,
  unauthorized,
  notFound,
  unknown,
}

class ApiException implements Exception {
  const ApiException({
    required this.message,
    required this.statusCode,
    this.code,
    this.details,
    this.type,
    this.stackTrace,
  });

  final String message;
  final int statusCode;
  final String? code;
  final Map<String, dynamic>? details;
  final ApiExceptionType? type;
  final StackTrace? stackTrace;

  ApiExceptionType get inferredType {
    if (type != null) return type!;
    if (statusCode == 0) return ApiExceptionType.network;
    if (statusCode == 401 || statusCode == 403) {
      return ApiExceptionType.unauthorized;
    }
    if (statusCode == 404) return ApiExceptionType.notFound;
    if (statusCode >= 400 && statusCode < 500) return ApiExceptionType.client;
    if (statusCode >= 500) return ApiExceptionType.server;
    return ApiExceptionType.unknown;
  }

  bool get isNetworkError => inferredType == ApiExceptionType.network;
  bool get isServerError => inferredType == ApiExceptionType.server;
  bool get isClientError => inferredType == ApiExceptionType.client;
  bool get isAuthError => inferredType == ApiExceptionType.unauthorized;
  bool get isNotFound => inferredType == ApiExceptionType.notFound;

  @override
  String toString() {
    final buffer = StringBuffer('ApiException: $message');
    if (statusCode > 0) buffer.write(' (Status: $statusCode)');
    if (code != null) buffer.write(' (Code: $code)');
    if (details != null) buffer.write(' (Details: $details)');
    return buffer.toString();
  }
}
