import 'package:app_core/app_core.dart';

/// Object mapping for [Carts]
/// Defines helper functions to help with bidirectional mapping
class Carts extends Equatable {
  /// Constructor for [Carts]
  /// Requires default values for non-nullable data
  const Carts({
    this.id = '',
    this.customerId = '',
    this.status = '',
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Carts.converterSingle(Map<String, dynamic> data) {
    return Carts.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Carts.fromJson(Map<String, dynamic> json) {
    return Carts(
      id: json[idConverter]?.toString() ?? '',
      customerId: json[customerIdConverter]?.toString() ?? '',
      status: json[statusConverter]?.toString() ?? '',
      createdAt: json[createdAtConverter] != null
          ? DateTime.tryParse(json[createdAtConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      updatedAt: json[updatedAtConverter] != null
          ? DateTime.tryParse(json[updatedAtConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
    );
  }

  // JSON string equivalent for our data
  static String get idConverter => 'id';
  static String get customerIdConverter => 'customer_id';
  static String get statusConverter => 'status';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Carts
  static const empty = Carts();

  // Data for Carts
  final String id;
  final String customerId;
  final String status;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        customerId,
        status,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Carts> converter(List<Map<String, dynamic>> data) {
    return data.map(Carts.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      customerId: customerId,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? customerId,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (customerId != null) customerIdConverter: customerId,
      if (status != null) statusConverter: status,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }
}

// Extensions to the object allowing a public getters
extension CartsExtensions on Carts {
  // Check if object is currently empty
  bool get isEmpty => this == Carts.empty;
}
