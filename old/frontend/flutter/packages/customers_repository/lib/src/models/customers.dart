import 'package:app_core/app_core.dart';

/// Object mapping for [Customers]
/// Defines helper functions to help with bidirectional mapping
class Customers extends Equatable {
  /// Constructor for [Customers]
  /// Requires default values for non-nullable data
  const Customers({
    this.id = '',
    this.businessName = '',
    this.contactName = '',
    this.email = '',
    this.phone = '',
    this.taxId = '',
    this.accountStatus = '',
    this.netTerms = 0,
    this.discountPercentage = 0.0,
    this.firstOrderDate,
    this.totalOrders = 0,
    this.lifetimeValue = 0.0,
    this.notes = '',
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Customers.converterSingle(Map<String, dynamic> data) {
    return Customers.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Customers.fromJson(Map<String, dynamic> json) {
    return Customers(
      id: json[idConverter]?.toString() ?? '',
      businessName: json[businessNameConverter]?.toString() ?? '',
      contactName: json[contactNameConverter]?.toString() ?? '',
      email: json[emailConverter]?.toString() ?? '',
      phone: json[phoneConverter]?.toString() ?? '',
      taxId: json[taxIdConverter]?.toString() ?? '',
      accountStatus: json[accountStatusConverter]?.toString() ?? '',
      netTerms: int.tryParse(json[netTermsConverter]?.toString() ?? '') ?? 0,
      discountPercentage: double.tryParse(
              json[discountPercentageConverter]?.toString() ?? '') ??
          0.0,
      firstOrderDate: json[firstOrderDateConverter] != null
          ? DateTime.tryParse(json[firstOrderDateConverter].toString())
                  ?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      totalOrders:
          int.tryParse(json[totalOrdersConverter]?.toString() ?? '') ?? 0,
      lifetimeValue:
          double.tryParse(json[lifetimeValueConverter]?.toString() ?? '') ??
              0.0,
      notes: json[notesConverter]?.toString() ?? '',
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
  static String get businessNameConverter => 'business_name';
  static String get contactNameConverter => 'contact_name';
  static String get emailConverter => 'email';
  static String get phoneConverter => 'phone';
  static String get taxIdConverter => 'tax_id';
  static String get accountStatusConverter => 'account_status';
  static String get netTermsConverter => 'net_terms';
  static String get discountPercentageConverter => 'discount_percentage';
  static String get firstOrderDateConverter => 'first_order_date';
  static String get totalOrdersConverter => 'total_orders';
  static String get lifetimeValueConverter => 'lifetime_value';
  static String get notesConverter => 'notes';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Customers
  static const empty = Customers();

  // Data for Customers
  final String id;
  final String businessName;
  final String contactName;
  final String email;
  final String phone;
  final String taxId;
  final String accountStatus;
  final int netTerms;
  final double discountPercentage;
  final DateTime? firstOrderDate;
  final int totalOrders;
  final double lifetimeValue;
  final String notes;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        businessName,
        contactName,
        email,
        phone,
        taxId,
        accountStatus,
        netTerms,
        discountPercentage,
        firstOrderDate,
        totalOrders,
        lifetimeValue,
        notes,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Customers> converter(List<Map<String, dynamic>> data) {
    return data.map(Customers.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      businessName: businessName,
      contactName: contactName,
      email: email,
      phone: phone,
      taxId: taxId,
      accountStatus: accountStatus,
      netTerms: netTerms,
      discountPercentage: discountPercentage,
      firstOrderDate: firstOrderDate,
      totalOrders: totalOrders,
      lifetimeValue: lifetimeValue,
      notes: notes,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? businessName,
    String? contactName,
    String? email,
    String? phone,
    String? taxId,
    String? accountStatus,
    int? netTerms,
    double? discountPercentage,
    DateTime? firstOrderDate,
    int? totalOrders,
    double? lifetimeValue,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (businessName != null) businessNameConverter: businessName,
      if (contactName != null) contactNameConverter: contactName,
      if (email != null) emailConverter: email,
      if (phone != null) phoneConverter: phone,
      if (taxId != null) taxIdConverter: taxId,
      if (accountStatus != null) accountStatusConverter: accountStatus,
      if (netTerms != null) netTermsConverter: netTerms,
      if (discountPercentage != null)
        discountPercentageConverter: discountPercentage,
      if (firstOrderDate != null)
        firstOrderDateConverter: firstOrderDate.toIso8601String(),
      if (totalOrders != null) totalOrdersConverter: totalOrders,
      if (lifetimeValue != null) lifetimeValueConverter: lifetimeValue,
      if (notes != null) notesConverter: notes,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }
}

// Extensions to the object allowing a public getters
extension CustomersExtensions on Customers {
  // Check if object is currently empty
  bool get isEmpty => this == Customers.empty;
}
