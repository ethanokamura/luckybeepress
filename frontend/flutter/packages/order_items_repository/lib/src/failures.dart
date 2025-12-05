import 'package:api_client/api_client.dart';

class OrderItemsFailure extends RepositoryFailure {
  const OrderItemsFailure({
    required super.message,
    required super.type,
    super.statusCode,
    super.details,
    super.stackTrace,
  });

  factory OrderItemsFailure.fromCreate([String? message, dynamic error]) {
    return OrderItemsFailure(
      message: message ?? 'Failed to create order items',
      type: FailureType.create,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory OrderItemsFailure.fromGet([String? message, dynamic error]) {
    return OrderItemsFailure(
      message: message ?? 'Failed to fetch order items',
      type: FailureType.get,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory OrderItemsFailure.fromUpdate([String? message, dynamic error]) {
    return OrderItemsFailure(
      message: message ?? 'Failed to update order items',
      type: FailureType.update,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory OrderItemsFailure.fromDelete([String? message, dynamic error]) {
    return OrderItemsFailure(
      message: message ?? 'Failed to delete order items',
      type: FailureType.delete,
      details: _extractErrorDetails(error),
      statusCode: _extractStatusCode(error),
    );
  }

  factory OrderItemsFailure.network([String? message, int? statusCode]) {
    return OrderItemsFailure(
      message: message ?? 'Network error occurred',
      type: FailureType.network,
      statusCode: statusCode,
    );
  }

  factory OrderItemsFailure.unauthorized([String? message]) {
    return OrderItemsFailure(
      message: message ?? 'You are not authorized to perform this action',
      type: FailureType.unauthorized,
      statusCode: 401,
    );
  }

  factory OrderItemsFailure.notFound([String? message]) {
    return OrderItemsFailure(
      message: message ?? 'Board not found',
      type: FailureType.notFound,
      statusCode: 404,
    );
  }

  factory OrderItemsFailure.validation(String message,
      [Map<String, dynamic>? details]) {
    return OrderItemsFailure(
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
        return 'The order items you\'re looking for doesn\'t exist.';
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
