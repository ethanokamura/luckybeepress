import 'package:api_client/api_client.dart';

class CustomersFailure extends RepositoryFailure {
  const CustomersFailure({
    required super.message,
    required super.type,
    super.statusCode,
    super.details,
    super.stackTrace,
  });

  factory CustomersFailure.fromCreate([String? message, dynamic error]) {
    return CustomersFailure(
      message: message ?? 'Failed to create customers',
      type: FailureType.create,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CustomersFailure.fromGet([String? message, dynamic error]) {
    return CustomersFailure(
      message: message ?? 'Failed to fetch customers',
      type: FailureType.get,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CustomersFailure.fromUpdate([String? message, dynamic error]) {
    return CustomersFailure(
      message: message ?? 'Failed to update customers',
      type: FailureType.update,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CustomersFailure.fromDelete([String? message, dynamic error]) {
    return CustomersFailure(
      message: message ?? 'Failed to delete customers',
      type: FailureType.delete,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CustomersFailure.network([String? message, int? statusCode]) {
    return CustomersFailure(
      message: message ?? 'Network error occurred',
      type: FailureType.network,
      statusCode: statusCode,
    );
  }

  factory CustomersFailure.unauthorized([String? message]) {
    return CustomersFailure(
      message: message ?? 'You are not authorized to perform this action',
      type: FailureType.unauthorized,
      statusCode: 401,
    );
  }

  factory CustomersFailure.notFound([String? message]) {
    return CustomersFailure(
      message: message ?? 'Board not found',
      type: FailureType.notFound,
      statusCode: 404,
    );
  }

  factory CustomersFailure.validation(String message,
      [Map<String, dynamic>? details]) {
    return CustomersFailure(
      message: message,
      type: FailureType.validation,
      statusCode: 400,
      details: details,
    );
  }

  @override
  String get userMessage {
    switch (type) {
      case FailureType.network:
        return 'Connection issue. Please check your internet and try again.';
      case FailureType.unauthorized:
        return 'You need to log in to perform this action.';
      case FailureType.notFound:
        return 'The customers you\'re looking for doesn\'t exist.';
      case FailureType.validation:
        return 'Please check your input and try again.';
      case FailureType.serverError:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return message;
    }
  }

  // Helper methods to extract error information
  static Map<String, dynamic>? _extractErrorDetails(dynamic error) {
    if (error == null) return null;
    if (error is Map<String, dynamic>) return error;
    if (error is String) return {'error': error};
    return {'error': error.toString()};
  }

  static int? _extractStatusCode(dynamic error) {
    if (error is Map<String, dynamic>) {
      return error['statusCode'] as int?;
    }
    return null;
  }
}
