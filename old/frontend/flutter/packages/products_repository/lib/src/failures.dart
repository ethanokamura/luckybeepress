import 'package:api_client/api_client.dart';

class ProductsFailure extends RepositoryFailure {
  const ProductsFailure({
    required super.message,
    required super.type,
    super.statusCode,
    super.details,
    super.stackTrace,
  });

  factory ProductsFailure.fromCreate([String? message, dynamic error]) {
    return ProductsFailure(
      message: message ?? 'Failed to create products',
      type: FailureType.create,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory ProductsFailure.fromGet([String? message, dynamic error]) {
    return ProductsFailure(
      message: message ?? 'Failed to fetch products',
      type: FailureType.get,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory ProductsFailure.fromUpdate([String? message, dynamic error]) {
    return ProductsFailure(
      message: message ?? 'Failed to update products',
      type: FailureType.update,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory ProductsFailure.fromDelete([String? message, dynamic error]) {
    return ProductsFailure(
      message: message ?? 'Failed to delete products',
      type: FailureType.delete,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory ProductsFailure.network([String? message, int? statusCode]) {
    return ProductsFailure(
      message: message ?? 'Network error occurred',
      type: FailureType.network,
      statusCode: statusCode,
    );
  }

  factory ProductsFailure.unauthorized([String? message]) {
    return ProductsFailure(
      message: message ?? 'You are not authorized to perform this action',
      type: FailureType.unauthorized,
      statusCode: 401,
    );
  }

  factory ProductsFailure.notFound([String? message]) {
    return ProductsFailure(
      message: message ?? 'Board not found',
      type: FailureType.notFound,
      statusCode: 404,
    );
  }

  factory ProductsFailure.validation(String message,
      [Map<String, dynamic>? details]) {
    return ProductsFailure(
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
        return 'The products you\'re looking for doesn\'t exist.';
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
