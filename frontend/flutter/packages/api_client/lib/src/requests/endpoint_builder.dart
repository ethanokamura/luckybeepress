import 'filters.dart';

class EndpointBuilder {
  final String baseEndpoint;
  final String? sortBy;
  final bool ascending;
  final String? cursor;
  final List<Filter> filters;
  final int limit;

  EndpointBuilder({
    required this.baseEndpoint,
    this.sortBy,
    this.ascending = false,
    this.cursor,
    this.filters = const [],
    this.limit = 25,
  });

  // Copy constructor for easy modification
  EndpointBuilder copyWith({
    String? baseEndpoint,
    String? sortBy,
    bool? ascending,
    String? cursor,
    List<Filter>? filters,
    int? limit,
  }) {
    return EndpointBuilder(
      baseEndpoint: baseEndpoint ?? this.baseEndpoint,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      cursor: cursor ?? this.cursor,
      filters: filters ?? this.filters,
      limit: limit ?? this.limit,
    );
  }

  String build() {
    final buffer = StringBuffer(baseEndpoint);
    final queryParams = <String>[];

    // Add equality filters
    if (filters.isNotEmpty) {
      for (final filter in filters) {
        queryParams.add(
            '${Uri.encodeQueryComponent(filter.key)}=${Uri.encodeQueryComponent(filter.value)}');
      }
    }

    // Add sorting parameters
    if (sortBy != null) {
      queryParams.add('order_by=${Uri.encodeQueryComponent(sortBy!)}');
    }
    queryParams
        .add('order=${Uri.encodeQueryComponent(ascending ? 'asc' : 'desc')}');
    // Add cursor if present
    if (cursor != null) {
      queryParams.add('cursor=${Uri.encodeQueryComponent(cursor!)}');
    }
    queryParams.add('limit=${Uri.encodeQueryComponent(limit.toString())}');

    // Join all query parameters
    if (queryParams.isNotEmpty) {
      buffer.write('?');
      buffer.write(queryParams.join('&'));
    }

    return buffer.toString();
  }

  @override
  String toString() => build();
}
