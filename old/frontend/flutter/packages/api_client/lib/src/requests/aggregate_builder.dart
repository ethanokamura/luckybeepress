import 'filters.dart';

class AggregateBuilder {
  final String baseEndpoint;
  final List<Filter> filters;

  AggregateBuilder({
    required this.baseEndpoint,
    this.filters = const [],
  });

  // Copy constructor for easy modification
  AggregateBuilder copyWith({
    String? baseEndpoint,
    List<Filter>? filters,
  }) {
    return AggregateBuilder(
      baseEndpoint: baseEndpoint ?? this.baseEndpoint,
      filters: filters ?? this.filters,
    );
  }

  String build() {
    final buffer = StringBuffer('$baseEndpoint/count');
    final queryParams = <String>[];

    // Add equality filters
    if (filters.isNotEmpty) {
      for (final filter in filters) {
        queryParams.add(
            '${Uri.encodeQueryComponent(filter.key)}=${Uri.encodeQueryComponent(filter.value)}');
      }
    }

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
