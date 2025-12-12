import 'package:app_core/app_core.dart';

/// Object mapping for [CartItems]
/// Defines helper functions to help with bidirectional mapping
class CartItems extends Equatable {
  /// Constructor for [CartItems]
  /// Requires default values for non-nullable data
  const CartItems({
    this.id = '',
    this.cartId = '',
    this.productId = '',
    this.quantity = 0,
    this.unitPrice = 0.0,
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory CartItems.converterSingle(Map<String, dynamic> data) {
    return CartItems.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory CartItems.fromJson(Map<String, dynamic> json) {
    return CartItems(
      id: json[idConverter]?.toString() ?? '',
      cartId: json[cartIdConverter]?.toString() ?? '',
      productId: json[productIdConverter]?.toString() ?? '',
      quantity: int.tryParse(json[quantityConverter]?.toString() ?? '') ?? 0,
      unitPrice:
          double.tryParse(json[unitPriceConverter]?.toString() ?? '') ?? 0.0,
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
  static String get cartIdConverter => 'cart_id';
  static String get productIdConverter => 'product_id';
  static String get quantityConverter => 'quantity';
  static String get unitPriceConverter => 'unit_price';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the CartItems
  static const empty = CartItems();

  // Data for CartItems
  final String id;
  final String cartId;
  final String productId;
  final int quantity;
  final double unitPrice;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        cartId,
        productId,
        quantity,
        unitPrice,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<CartItems> converter(List<Map<String, dynamic>> data) {
    return data.map(CartItems.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      cartId: cartId,
      productId: productId,
      quantity: quantity,
      unitPrice: unitPrice,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? cartId,
    String? productId,
    int? quantity,
    double? unitPrice,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (cartId != null) cartIdConverter: cartId,
      if (productId != null) productIdConverter: productId,
      if (quantity != null) quantityConverter: quantity,
      if (unitPrice != null) unitPriceConverter: unitPrice,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }
}

// Extensions to the object allowing a public getters
extension CartItemsExtensions on CartItems {
  // Check if object is currently empty
  bool get isEmpty => this == CartItems.empty;
}
