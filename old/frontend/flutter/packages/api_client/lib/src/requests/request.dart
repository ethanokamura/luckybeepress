// requests.dart
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter/foundation.dart';
import 'response.dart';
import 'exceptions.dart';
import '../env_config.dart';

/// Configuration for API requests
class RequestConfig {
  const RequestConfig({
    this.sendTimeout = const Duration(seconds: 10),
    this.receiveTimeout = const Duration(seconds: 30),
    this.connectTimeout = const Duration(seconds: 10),
    this.contentType = 'application/json; charset=UTF-8',
    this.validateStatus,
  });

  final Duration sendTimeout;
  final Duration receiveTimeout;
  final Duration connectTimeout;
  final String contentType;
  final bool Function(int?)? validateStatus;

  Options toOptions({Map<String, String>? headers}) {
    return Options(
      headers: {
        'Content-Type': contentType,
        ...?headers,
      },
      sendTimeout: sendTimeout,
      receiveTimeout: receiveTimeout,
      validateStatus: validateStatus ??
          (status) => status != null && status >= 200 && status < 300,
    );
  }
}

/// Main request handler with typed responses
class ApiClient {
  ApiClient({RequestConfig? config})
      : _config = config ?? const RequestConfig(),
        _dio = GetIt.instance<Dio>();

  final RequestConfig _config;
  final Dio _dio;

  /// Make a typed request that returns ApiResponse
  Future<ApiResponse<T>> request<T>({
    required String method,
    required String endpoint,
    Map<String, String>? headers,
    Map<String, dynamic>? payload,
    T Function(dynamic json)? fromJson,
    RequestConfig? config,
  }) async {
    final url = _buildUrl(endpoint);
    final options = (config ?? _config).toOptions(headers: headers);

    debugPrint('${method.toUpperCase()} $url');
    if (payload != null) debugPrint('Payload: $payload');

    try {
      final response = await _executeRequest(
        method: method,
        url: url,
        options: options,
        payload: payload,
      );

      return _handleResponse<T>(response, fromJson);
    } on DioException catch (e) {
      throw _handleDioException(e);
    } catch (e, stackTrace) {
      throw ApiException(
        message: 'Unexpected error: $e',
        statusCode: 0,
        stackTrace: stackTrace,
      );
    }
  }

  /// Make a typed request that returns PaginatedResponse
  Future<PaginatedResponse<T>> paginatedRequest<T>({
    required String method,
    required String endpoint,
    required T Function(dynamic json) fromJson,
    Map<String, String>? headers,
    Map<String, dynamic>? payload,
    RequestConfig? config,
  }) async {
    final url = _buildUrl(endpoint);
    final options = (config ?? _config).toOptions(headers: headers);

    debugPrint('${method.toUpperCase()} $url');
    if (payload != null) debugPrint('Payload: $payload');

    try {
      final response = await _executeRequest(
        method: method,
        url: url,
        options: options,
        payload: payload,
      );

      return _handlePaginatedResponse<T>(response, fromJson);
    } on DioException catch (e) {
      throw _handleDioException(e);
    } catch (e, stackTrace) {
      throw ApiException(
        message: 'Unexpected error: $e',
        statusCode: 0,
        stackTrace: stackTrace,
      );
    }
  }

  /// Make a raw request that returns dynamic data
  Future<dynamic> rawRequest({
    required String method,
    required String endpoint,
    Map<String, String>? headers,
    Map<String, dynamic>? payload,
    RequestConfig? config,
  }) async {
    final url = _buildUrl(endpoint);
    final options = (config ?? _config).toOptions(headers: headers);

    debugPrint('${method.toUpperCase()} $url');

    try {
      final response = await _executeRequest(
        method: method,
        url: url,
        options: options,
        payload: payload,
      );

      return response.data;
    } on DioException catch (e) {
      throw _handleDioException(e);
    } catch (e, stackTrace) {
      throw ApiException(
        message: 'Unexpected error: $e',
        statusCode: 0,
        stackTrace: stackTrace,
      );
    }
  }

  /// Execute the HTTP request based on method
  Future<Response> _executeRequest({
    required String method,
    required String url,
    required Options options,
    Map<String, dynamic>? payload,
  }) async {
    switch (method.toUpperCase()) {
      case 'GET':
        return await _dio.get(url, queryParameters: payload, options: options);
      case 'POST':
        return await _dio.post(url, data: payload, options: options);
      case 'PUT':
        return await _dio.put(url, data: payload, options: options);
      case 'PATCH':
        return await _dio.patch(url, data: payload, options: options);
      case 'DELETE':
        return await _dio.delete(url, data: payload, options: options);
      default:
        throw ArgumentError('Unsupported HTTP method: $method');
    }
  }

  /// Handle successful response and parse to ApiResponse
  ApiResponse<T> _handleResponse<T>(
    Response response,
    T Function(dynamic json)? fromJson,
  ) {
    if (response.data is! Map<String, dynamic>) {
      throw ApiException(
        message: 'Unexpected response format: ${response.data.runtimeType}',
        statusCode: response.statusCode ?? 0,
        details: {'responseType': response.data.runtimeType.toString()},
      );
    }

    final json = response.data as Map<String, dynamic>;

    // Add status code to response if not present
    if (!json.containsKey('statusCode')) {
      json['statusCode'] = response.statusCode;
    }

    return ApiResponse<T>.fromJson(
      json,
      fromJson != null ? (data) => fromJson(data) : null,
    );
  }

  /// Handle successful response and parse to ApiResponse
  PaginatedResponse<T> _handlePaginatedResponse<T>(
    Response response,
    T Function(dynamic json) fromJson,
  ) {
    if (response.data is! Map<String, dynamic>) {
      throw ApiException(
        message: 'Unexpected response format: ${response.data.runtimeType}',
        statusCode: response.statusCode ?? 0,
        details: {'responseType': response.data.runtimeType.toString()},
      );
    }

    final json = response.data as Map<String, dynamic>;

    // Add status code to response if not present
    if (!json.containsKey('statusCode')) {
      json['statusCode'] = response.statusCode;
    }

    return PaginatedResponse<T>.fromJson(
      json,
      (data) => fromJson(data),
    );
  }

  /// Handle DioException and convert to ApiException
  ApiException _handleDioException(DioException e) {
    if (e.response != null) {
      return _handleErrorResponse(e.response!);
    }

    // Network/timeout errors
    return _handleNetworkError(e);
  }

  /// Handle error responses from server
  ApiException _handleErrorResponse(Response response) {
    final statusCode = response.statusCode ?? 0;
    String message;
    Map<String, dynamic>? details;
    String? errorCode;

    try {
      if (response.data is Map<String, dynamic>) {
        final errorData = response.data as Map<String, dynamic>;
        message = errorData['message'] as String? ??
            errorData['error'] as String? ??
            response.statusMessage ??
            'Server error';
        errorCode = errorData['code'] as String?;
        details = errorData['details'] as Map<String, dynamic>?;
      } else {
        message = response.statusMessage ?? 'Server error';
        details = {'rawResponse': response.data.toString()};
      }
    } catch (_) {
      message = 'Server error: ${response.statusMessage ?? 'Unknown'}';
      details = {'rawResponse': response.data.toString()};
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      code: errorCode,
      details: details,
    );
  }

  /// Handle network-related errors
  ApiException _handleNetworkError(DioException e) {
    String message;

    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        message = 'Connection timed out. Please check your network.';
        break;
      case DioExceptionType.receiveTimeout:
        message = 'Server took too long to respond. Please try again.';
        break;
      case DioExceptionType.sendTimeout:
        message = 'Failed to send request. Please check your network.';
        break;
      case DioExceptionType.connectionError:
        message = 'No internet connection. Please check your network.';
        break;
      case DioExceptionType.cancel:
        message = 'Request was cancelled.';
        break;
      case DioExceptionType.badCertificate:
        message = 'Security certificate error.';
        break;
      default:
        message = 'Network error: ${e.message ?? 'Unknown error'}';
    }

    return ApiException(
      message: message,
      statusCode: 0,
      type: ApiExceptionType.network,
    );
  }

  /// Build full URL from endpoint
  String _buildUrl(String endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return '${ApiConfig.apiEndpointUrl}/${ApiConfig.apiVersion}/$endpoint';
  }
}
