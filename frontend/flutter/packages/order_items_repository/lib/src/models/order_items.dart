import 'package:app_core/app_core.dart';

/// Object mapping for [OrderItems]
/// Defines helper functions to help with bidirectional mapping
class OrderItems extends Equatable {
  /// Constructor for [OrderItems]
  /// Requires default values for non-nullable data
  const OrderItems({
    this.id = '',
    this.orderId = '',
    this.productId = '',
    this.sku = '',
    this.productName = '',
    this.quantity = 0,
    this.unitWholesalePrice = 0.0,
    this.unitRetailPrice = 0.0,
    this.subtotal = 0.0,
    this.status = '',
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory OrderItems.converterSingle(Map<String, dynamic> data) {
    return OrderItems.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory OrderItems.fromJson(Map<String, dynamic> json) {
    return OrderItems(
      id: json[idConverter]?.toString() ?? '',
      orderId: json[orderIdConverter]?.toString() ?? '',
      productId: json[productIdConverter]?.toString() ?? '',
      sku: json[skuConverter]?.toString() ?? '',
      productName: json[productNameConverter]?.toString() ?? '',
      quantity: int.tryParse(json[quantityConverter]?.toString() ?? '') ?? 0,
      unitWholesalePrice: double.tryParse(
              json[unitWholesalePriceConverter]?.toString() ?? '') ??
          0.0,
      unitRetailPrice:
          double.tryParse(json[unitRetailPriceConverter]?.toString() ?? '') ??
              0.0,
      subtotal:
          double.tryParse(json[subtotalConverter]?.toString() ?? '') ?? 0.0,
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
  static String get orderIdConverter => 'order_id';
  static String get productIdConverter => 'product_id';
  static String get skuConverter => 'sku';
  static String get productNameConverter => 'product_name';
  static String get quantityConverter => 'quantity';
  static String get unitWholesalePriceConverter => 'unit_wholesale_price';
  static String get unitRetailPriceConverter => 'unit_retail_price';
  static String get subtotalConverter => 'subtotal';
  static String get statusConverter => 'status';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the OrderItems
  static const empty = OrderItems();

  // Data for OrderItems
  final String id;
  final String orderId;
  final String productId;
  final String sku;
  final String productName;
  final int quantity;
  final double unitWholesalePrice;
  final double unitRetailPrice;
  final double subtotal;
  final String status;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        orderId,
        productId,
        sku,
        productName,
        quantity,
        unitWholesalePrice,
        unitRetailPrice,
        subtotal,
        status,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<OrderItems> converter(List<Map<String, dynamic>> data) {
    return data.map(OrderItems.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      orderId: orderId,
      productId: productId,
      sku: sku,
      productName: productName,
      quantity: quantity,
      unitWholesalePrice: unitWholesalePrice,
      unitRetailPrice: unitRetailPrice,
      subtotal: subtotal,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? orderId,
    String? productId,
    String? sku,
    String? productName,
    int? quantity,
    double? unitWholesalePrice,
    double? unitRetailPrice,
    double? subtotal,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (orderId != null) orderIdConverter: orderId,
      if (productId != null) productIdConverter: productId,
      if (sku != null) skuConverter: sku,
      if (productName != null) productNameConverter: productName,
      if (quantity != null) quantityConverter: quantity,
      if (unitWholesalePrice != null)
        unitWholesalePriceConverter: unitWholesalePrice,
      if (unitRetailPrice != null) unitRetailPriceConverter: unitRetailPrice,
      if (subtotal != null) subtotalConverter: subtotal,
      if (status != null) statusConverter: status,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }
}

// Extensions to the object allowing a public getters
extension OrderItemsExtensions on OrderItems {
  // Check if object is currently empty
  bool get isEmpty => this == OrderItems.empty;
}
