/// Base API response wrapper
class ApiResponse<T> {
  const ApiResponse({
    required this.success,
    required this.statusCode,
    this.data,
    this.error,
    this.message,
  });

  final bool success;
  final int statusCode;
  final T? data;
  final ApiError? error;
  final String? message;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: _parseBool(json['success']),
      statusCode: json['statusCode'] as int? ?? 0,
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'] as T?,
      error: json['error'] != null
          ? ApiError.fromJson(json['error'] as Map<String, dynamic>)
          : null,
      message: json['message'] as String?,
    );
  }

  Map<String, dynamic> toJson(Object? Function(T value)? toJsonT) {
    return {
      'success': success,
      'statusCode': statusCode,
      if (data != null) 'data': toJsonT != null ? toJsonT(data as T) : data,
      if (error != null) 'error': error!.toJson(),
      if (message != null) 'message': message,
    };
  }

  bool get isSuccess => success && statusCode >= 200 && statusCode < 300;
  bool get isError => !success || statusCode >= 400;

  static bool _parseBool(dynamic value) {
    if (value == null) return false;
    if (value is bool) return value;
    if (value is String) return value.toLowerCase() == 'true';
    if (value is int) return value != 0;
    return false;
  }
}

/// API Error details
class ApiError {
  const ApiError({
    required this.message,
    this.code,
    this.details,
    this.field,
  });

  final String message;
  final String? code;
  final Map<String, dynamic>? details;
  final String? field;

  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(
      message: json['message'] as String? ?? 'Unknown error',
      code: json['code'] as String?,
      details: json['details'] as Map<String, dynamic>?,
      field: json['field'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      if (code != null) 'code': code,
      if (details != null) 'details': details,
      if (field != null) 'field': field,
    };
  }
}

/// Paginated response wrapper
class PaginatedResponse<T> {
  const PaginatedResponse({
    required this.success,
    required this.statusCode,
    this.data,
    this.hasNextPage,
    this.nextCursor,
    this.prevCursor,
    this.total,
    this.page,
    this.pageSize,
    this.error,
  });

  final bool success;
  final int statusCode;
  final List<T>? data;
  final bool? hasNextPage;
  final String? nextCursor;
  final String? prevCursor;
  final int? total;
  final int? page;
  final int? pageSize;
  final ApiError? error;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    return PaginatedResponse<T>(
      success: _parseBool(json['success']),
      statusCode: json['statusCode'] as int? ?? 0,
      data: (json['data'] as List<dynamic>?)
              ?.map((item) => fromJsonT(item))
              .toList() ??
          [],
      hasNextPage: _parseBool(json['hasNextPage']),
      nextCursor: json['nextCursor'] as String?,
      prevCursor: json['prevCursor'] as String?,
      total: json['total'] as int?,
      page: json['page'] as int?,
      pageSize: json['pageSize'] as int?,
      error: json['error'] != null
          ? ApiError.fromJson(json['error'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson(Object? Function(T value) toJsonT) {
    return {
      'success': success,
      'statusCode': statusCode,
      if (data != null) 'data': data!.map((item) => toJsonT(item)).toList(),
      if (hasNextPage != null) 'hasNextPage': hasNextPage,
      if (nextCursor != null) 'nextCursor': nextCursor,
      if (prevCursor != null) 'prevCursor': prevCursor,
      if (total != null) 'total': total,
      if (page != null) 'page': page,
      if (pageSize != null) 'pageSize': pageSize,
      if (error != null) 'error': error!.toJson(),
    };
  }

  bool get isSuccess => success && statusCode >= 200 && statusCode < 300;
  bool get isError => !success || statusCode >= 400;

  static bool _parseBool(dynamic value) {
    if (value == null) return false;
    if (value is bool) return value;
    if (value is String) return value.toLowerCase() == 'true';
    if (value is int) return value != 0;
    return false;
  }
}
