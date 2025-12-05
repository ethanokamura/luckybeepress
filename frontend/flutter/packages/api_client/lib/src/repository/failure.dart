enum FailureType {
  create,
  get,
  update,
  delete,
  network,
  cache,
  validation,
  unauthorized,
  notFound,
  serverError,
  unknown,
  empty,
}

/// Base failure class that all repository failures extend
abstract class RepositoryFailure implements Exception {
  const RepositoryFailure({
    required this.message,
    required this.type,
    this.statusCode,
    this.details,
    this.stackTrace,
  });

  final String message;
  final FailureType type;
  final int? statusCode;
  final Map<String, dynamic>? details;
  final StackTrace? stackTrace;

  /// User-friendly message for UI display
  String get userMessage => message;

  @override
  String toString() =>
      '$runtimeType: $message (type: $type, statusCode: $statusCode)';
}
