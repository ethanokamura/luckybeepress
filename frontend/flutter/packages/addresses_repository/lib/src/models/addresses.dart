import 'package:app_core/app_core.dart';

/// Object mapping for [Addresses]
/// Defines helper functions to help with bidirectional mapping
class Addresses extends Equatable {
  /// Constructor for [Addresses]
  /// Requires default values for non-nullable data
  const Addresses({
    this.id = '',
    this.customerId = '',
    this.addressType = '',
    this.isDefault = false,
    this.companyName = '',
    this.streetAddress1 = '',
    this.streetAddress2 = '',
    this.city = '',
    this.state = '',
    this.postalCode = '',
    this.country = '',
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Addresses.converterSingle(Map<String, dynamic> data) {
    return Addresses.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Addresses.fromJson(Map<String, dynamic> json) {
    return Addresses(
      id: json[idConverter]?.toString() ?? '',
      customerId: json[customerIdConverter]?.toString() ?? '',
      addressType: json[addressTypeConverter]?.toString() ?? '',
      isDefault: Addresses._parseBool(json[isDefaultConverter]),
      companyName: json[companyNameConverter]?.toString() ?? '',
      streetAddress1: json[streetAddress1Converter]?.toString() ?? '',
      streetAddress2: json[streetAddress2Converter]?.toString() ?? '',
      city: json[cityConverter]?.toString() ?? '',
      state: json[stateConverter]?.toString() ?? '',
      postalCode: json[postalCodeConverter]?.toString() ?? '',
      country: json[countryConverter]?.toString() ?? '',
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
  static String get addressTypeConverter => 'address_type';
  static String get isDefaultConverter => 'is_default';
  static String get companyNameConverter => 'company_name';
  static String get streetAddress1Converter => 'street_address_1';
  static String get streetAddress2Converter => 'street_address_2';
  static String get cityConverter => 'city';
  static String get stateConverter => 'state';
  static String get postalCodeConverter => 'postal_code';
  static String get countryConverter => 'country';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Addresses
  static const empty = Addresses();

  // Data for Addresses
  final String id;
  final String customerId;
  final String addressType;
  final bool isDefault;
  final String companyName;
  final String streetAddress1;
  final String streetAddress2;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        customerId,
        addressType,
        isDefault,
        companyName,
        streetAddress1,
        streetAddress2,
        city,
        state,
        postalCode,
        country,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Addresses> converter(List<Map<String, dynamic>> data) {
    return data.map(Addresses.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      customerId: customerId,
      addressType: addressType,
      isDefault: isDefault,
      companyName: companyName,
      streetAddress1: streetAddress1,
      streetAddress2: streetAddress2,
      city: city,
      state: state,
      postalCode: postalCode,
      country: country,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? customerId,
    String? addressType,
    bool? isDefault,
    String? companyName,
    String? streetAddress1,
    String? streetAddress2,
    String? city,
    String? state,
    String? postalCode,
    String? country,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (customerId != null) customerIdConverter: customerId,
      if (addressType != null) addressTypeConverter: addressType,
      if (isDefault != null) isDefaultConverter: isDefault,
      if (companyName != null) companyNameConverter: companyName,
      if (streetAddress1 != null) streetAddress1Converter: streetAddress1,
      if (streetAddress2 != null) streetAddress2Converter: streetAddress2,
      if (city != null) cityConverter: city,
      if (state != null) stateConverter: state,
      if (postalCode != null) postalCodeConverter: postalCode,
      if (country != null) countryConverter: country,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }

  // Helper function to safely parse boolean values, handling various input types
  static bool _parseBool(dynamic value) {
    if (value == null) {
      return false;
    }
    if (value is bool) {
      return value;
    }
    if (value is String) {
      return value.toLowerCase() == 'true';
    }
    if (value is int) {
      return value != 0;
    }
    return false;
  }
}

// Extensions to the object allowing a public getters
extension AddressesExtensions on Addresses {
  // Check if object is currently empty
  bool get isEmpty => this == Addresses.empty;
}
