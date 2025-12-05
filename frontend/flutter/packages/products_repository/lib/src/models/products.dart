import 'package:app_core/app_core.dart';

/// Object mapping for [Products]
/// Defines helper functions to help with bidirectional mapping
class Products extends Equatable {
  /// Constructor for [Products]
  /// Requires default values for non-nullable data
  const Products({
    this.id = '',
    this.sku = '',
    this.name = '',
    this.description = '',
    this.category = '',
    this.wholesalePrice = 0.0,
    this.suggestedRetailPrice = 0.0,
    this.cost = 0.0,
    this.isActive = false,
    this.minimumOrderQuantity = 0,
    this.stockQuantity = 0,
    this.lowStockThreshold = 0,
    this.imageUrl = '',
    this.weightOz = 0.0,
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Products.converterSingle(Map<String, dynamic> data) {
    return Products.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Products.fromJson(Map<String, dynamic> json) {
    return Products(
      id: json[idConverter]?.toString() ?? '',
      sku: json[skuConverter]?.toString() ?? '',
      name: json[nameConverter]?.toString() ?? '',
      description: json[descriptionConverter]?.toString() ?? '',
      category: json[categoryConverter]?.toString() ?? '',
      wholesalePrice:
          double.tryParse(json[wholesalePriceConverter]?.toString() ?? '') ??
              0.0,
      suggestedRetailPrice: double.tryParse(
              json[suggestedRetailPriceConverter]?.toString() ?? '') ??
          0.0,
      cost: double.tryParse(json[costConverter]?.toString() ?? '') ?? 0.0,
      isActive: Products._parseBool(json[isActiveConverter]),
      minimumOrderQuantity:
          int.tryParse(json[minimumOrderQuantityConverter]?.toString() ?? '') ??
              0,
      stockQuantity:
          int.tryParse(json[stockQuantityConverter]?.toString() ?? '') ?? 0,
      lowStockThreshold:
          int.tryParse(json[lowStockThresholdConverter]?.toString() ?? '') ?? 0,
      imageUrl: json[imageUrlConverter]?.toString() ?? '',
      weightOz:
          double.tryParse(json[weightOzConverter]?.toString() ?? '') ?? 0.0,
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
  static String get skuConverter => 'sku';
  static String get nameConverter => 'name';
  static String get descriptionConverter => 'description';
  static String get categoryConverter => 'category';
  static String get wholesalePriceConverter => 'wholesale_price';
  static String get suggestedRetailPriceConverter => 'suggested_retail_price';
  static String get costConverter => 'cost';
  static String get isActiveConverter => 'is_active';
  static String get minimumOrderQuantityConverter => 'minimum_order_quantity';
  static String get stockQuantityConverter => 'stock_quantity';
  static String get lowStockThresholdConverter => 'low_stock_threshold';
  static String get imageUrlConverter => 'image_url';
  static String get weightOzConverter => 'weight_oz';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Products
  static const empty = Products();

  // Data for Products
  final String id;
  final String sku;
  final String name;
  final String description;
  final String category;
  final double wholesalePrice;
  final double suggestedRetailPrice;
  final double cost;
  final bool isActive;
  final int minimumOrderQuantity;
  final int stockQuantity;
  final int lowStockThreshold;
  final String imageUrl;
  final double weightOz;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        sku,
        name,
        description,
        category,
        wholesalePrice,
        suggestedRetailPrice,
        cost,
        isActive,
        minimumOrderQuantity,
        stockQuantity,
        lowStockThreshold,
        imageUrl,
        weightOz,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Products> converter(List<Map<String, dynamic>> data) {
    return data.map(Products.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      sku: sku,
      name: name,
      description: description,
      category: category,
      wholesalePrice: wholesalePrice,
      suggestedRetailPrice: suggestedRetailPrice,
      cost: cost,
      isActive: isActive,
      minimumOrderQuantity: minimumOrderQuantity,
      stockQuantity: stockQuantity,
      lowStockThreshold: lowStockThreshold,
      imageUrl: imageUrl,
      weightOz: weightOz,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? sku,
    String? name,
    String? description,
    String? category,
    double? wholesalePrice,
    double? suggestedRetailPrice,
    double? cost,
    bool? isActive,
    int? minimumOrderQuantity,
    int? stockQuantity,
    int? lowStockThreshold,
    String? imageUrl,
    double? weightOz,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (sku != null) skuConverter: sku,
      if (name != null) nameConverter: name,
      if (description != null) descriptionConverter: description,
      if (category != null) categoryConverter: category,
      if (wholesalePrice != null) wholesalePriceConverter: wholesalePrice,
      if (suggestedRetailPrice != null)
        suggestedRetailPriceConverter: suggestedRetailPrice,
      if (cost != null) costConverter: cost,
      if (isActive != null) isActiveConverter: isActive,
      if (minimumOrderQuantity != null)
        minimumOrderQuantityConverter: minimumOrderQuantity,
      if (stockQuantity != null) stockQuantityConverter: stockQuantity,
      if (lowStockThreshold != null)
        lowStockThresholdConverter: lowStockThreshold,
      if (imageUrl != null) imageUrlConverter: imageUrl,
      if (weightOz != null) weightOzConverter: weightOz,
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
extension ProductsExtensions on Products {
  // Check if object is currently empty
  bool get isEmpty => this == Products.empty;
}
