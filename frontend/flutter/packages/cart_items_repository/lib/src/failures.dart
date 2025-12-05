import 'package:api_client/api_client.dart';

class CartItemsFailure extends RepositoryFailure {
  const CartItemsFailure({
    required super.message,
    required super.type,
    super.statusCode,
    super.details,
    super.stackTrace,
  });

  factory CartItemsFailure.fromCreate([String? message, dynamic error]) {
    return CartItemsFailure(
      message: message ?? 'Failed to create cart items',
      type: FailureType.create,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CartItemsFailure.fromGet([String? message, dynamic error]) {
    return CartItemsFailure(
      message: message ?? 'Failed to fetch cart items',
      type: FailureType.get,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CartItemsFailure.fromUpdate([String? message, dynamic error]) {
    return CartItemsFailure(
      message: message ?? 'Failed to update cart items',
      type: FailureType.update,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CartItemsFailure.fromDelete([String? message, dynamic error]) {
    return CartItemsFailure(
      message: message ?? 'Failed to delete cart items',
      type: FailureType.delete,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory CartItemsFailure.network([String? message, int? statusCode]) {
    return CartItemsFailure(
      message: message ?? 'Network error occurred',
      type: FailureType.network,
      statusCode: statusCode,
    );
  }

  factory CartItemsFailure.unauthorized([String? message]) {
    return CartItemsFailure(
      message: message ?? 'You are not authorized to perform this action',
      type: FailureType.unauthorized,
      statusCode: 401,
    );
  }

  factory CartItemsFailure.notFound([String? message]) {
    return CartItemsFailure(
      message: message ?? 'Board not found',
      type: FailureType.notFound,
      statusCode: 404,
    );
  }

  factory CartItemsFailure.validation(String message,
      [Map<String, dynamic>? details]) {
    return CartItemsFailure(
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
        return 'The cart items you\'re looking for doesn\'t exist.';
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
