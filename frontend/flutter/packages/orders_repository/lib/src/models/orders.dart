import 'package:app_core/app_core.dart';

/// Object mapping for [Orders]
/// Defines helper functions to help with bidirectional mapping
class Orders extends Equatable {
  /// Constructor for [Orders]
  /// Requires default values for non-nullable data
  const Orders({
    this.id = '',
    this.orderNumber = '',
    this.customerId = '',
    this.shippingCompanyName = '',
    this.shippingAddress1 = '',
    this.shippingAddress2 = '',
    this.shippingCity = '',
    this.shippingState = '',
    this.shippingPostalCode = '',
    this.shippingCountry = '',
    this.shippingPhone = '',
    this.billingCompanyName = '',
    this.billingAddress1 = '',
    this.billingAddress2 = '',
    this.billingCity = '',
    this.billingState = '',
    this.billingPostalCode = '',
    this.billingCountry = '',
    this.subtotal = 0.0,
    this.shippingCost = 0.0,
    this.taxAmount = 0.0,
    this.discountAmount = 0.0,
    this.totalAmount = 0.0,
    this.status = '',
    this.paymentStatus = '',
    this.paymentMethod = '',
    this.paymentDueDate,
    this.orderDate,
    this.shipDate,
    this.deliveryDate,
    this.cancelledDate,
    this.trackingNumber = '',
    this.carrier = '',
    this.internalNotes = '',
    this.customerNotes = '',
    this.createdAt,
    this.updatedAt,
  });

  // Helper function that converts a single SQL object to our dart object
  factory Orders.converterSingle(Map<String, dynamic> data) {
    return Orders.fromJson(data);
  }

  // Helper function that converts a JSON object to our dart object
  factory Orders.fromJson(Map<String, dynamic> json) {
    return Orders(
      id: json[idConverter]?.toString() ?? '',
      orderNumber: json[orderNumberConverter]?.toString() ?? '',
      customerId: json[customerIdConverter]?.toString() ?? '',
      shippingCompanyName: json[shippingCompanyNameConverter]?.toString() ?? '',
      shippingAddress1: json[shippingAddress1Converter]?.toString() ?? '',
      shippingAddress2: json[shippingAddress2Converter]?.toString() ?? '',
      shippingCity: json[shippingCityConverter]?.toString() ?? '',
      shippingState: json[shippingStateConverter]?.toString() ?? '',
      shippingPostalCode: json[shippingPostalCodeConverter]?.toString() ?? '',
      shippingCountry: json[shippingCountryConverter]?.toString() ?? '',
      shippingPhone: json[shippingPhoneConverter]?.toString() ?? '',
      billingCompanyName: json[billingCompanyNameConverter]?.toString() ?? '',
      billingAddress1: json[billingAddress1Converter]?.toString() ?? '',
      billingAddress2: json[billingAddress2Converter]?.toString() ?? '',
      billingCity: json[billingCityConverter]?.toString() ?? '',
      billingState: json[billingStateConverter]?.toString() ?? '',
      billingPostalCode: json[billingPostalCodeConverter]?.toString() ?? '',
      billingCountry: json[billingCountryConverter]?.toString() ?? '',
      subtotal:
          double.tryParse(json[subtotalConverter]?.toString() ?? '') ?? 0.0,
      shippingCost:
          double.tryParse(json[shippingCostConverter]?.toString() ?? '') ?? 0.0,
      taxAmount:
          double.tryParse(json[taxAmountConverter]?.toString() ?? '') ?? 0.0,
      discountAmount:
          double.tryParse(json[discountAmountConverter]?.toString() ?? '') ??
              0.0,
      totalAmount:
          double.tryParse(json[totalAmountConverter]?.toString() ?? '') ?? 0.0,
      status: json[statusConverter]?.toString() ?? '',
      paymentStatus: json[paymentStatusConverter]?.toString() ?? '',
      paymentMethod: json[paymentMethodConverter]?.toString() ?? '',
      paymentDueDate: json[paymentDueDateConverter] != null
          ? DateTime.tryParse(json[paymentDueDateConverter].toString())
                  ?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      orderDate: json[orderDateConverter] != null
          ? DateTime.tryParse(json[orderDateConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      shipDate: json[shipDateConverter] != null
          ? DateTime.tryParse(json[shipDateConverter].toString())?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      deliveryDate: json[deliveryDateConverter] != null
          ? DateTime.tryParse(json[deliveryDateConverter].toString())
                  ?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      cancelledDate: json[cancelledDateConverter] != null
          ? DateTime.tryParse(json[cancelledDateConverter].toString())
                  ?.toUtc() ??
              DateTime.now().toUtc()
          : DateTime.now().toUtc(),
      trackingNumber: json[trackingNumberConverter]?.toString() ?? '',
      carrier: json[carrierConverter]?.toString() ?? '',
      internalNotes: json[internalNotesConverter]?.toString() ?? '',
      customerNotes: json[customerNotesConverter]?.toString() ?? '',
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
  static String get orderNumberConverter => 'order_number';
  static String get customerIdConverter => 'customer_id';
  static String get shippingCompanyNameConverter => 'shipping_company_name';
  static String get shippingAddress1Converter => 'shipping_address_1';
  static String get shippingAddress2Converter => 'shipping_address_2';
  static String get shippingCityConverter => 'shipping_city';
  static String get shippingStateConverter => 'shipping_state';
  static String get shippingPostalCodeConverter => 'shipping_postal_code';
  static String get shippingCountryConverter => 'shipping_country';
  static String get shippingPhoneConverter => 'shipping_phone';
  static String get billingCompanyNameConverter => 'billing_company_name';
  static String get billingAddress1Converter => 'billing_address_1';
  static String get billingAddress2Converter => 'billing_address_2';
  static String get billingCityConverter => 'billing_city';
  static String get billingStateConverter => 'billing_state';
  static String get billingPostalCodeConverter => 'billing_postal_code';
  static String get billingCountryConverter => 'billing_country';
  static String get subtotalConverter => 'subtotal';
  static String get shippingCostConverter => 'shipping_cost';
  static String get taxAmountConverter => 'tax_amount';
  static String get discountAmountConverter => 'discount_amount';
  static String get totalAmountConverter => 'total_amount';
  static String get statusConverter => 'status';
  static String get paymentStatusConverter => 'payment_status';
  static String get paymentMethodConverter => 'payment_method';
  static String get paymentDueDateConverter => 'payment_due_date';
  static String get orderDateConverter => 'order_date';
  static String get shipDateConverter => 'ship_date';
  static String get deliveryDateConverter => 'delivery_date';
  static String get cancelledDateConverter => 'cancelled_date';
  static String get trackingNumberConverter => 'tracking_number';
  static String get carrierConverter => 'carrier';
  static String get internalNotesConverter => 'internal_notes';
  static String get customerNotesConverter => 'customer_notes';
  static String get createdAtConverter => 'created_at';
  static String get updatedAtConverter => 'updated_at';

  // Defines the empty state for the Orders
  static const empty = Orders();

  // Data for Orders
  final String id;
  final String orderNumber;
  final String customerId;
  final String shippingCompanyName;
  final String shippingAddress1;
  final String shippingAddress2;
  final String shippingCity;
  final String shippingState;
  final String shippingPostalCode;
  final String shippingCountry;
  final String shippingPhone;
  final String billingCompanyName;
  final String billingAddress1;
  final String billingAddress2;
  final String billingCity;
  final String billingState;
  final String billingPostalCode;
  final String billingCountry;
  final double subtotal;
  final double shippingCost;
  final double taxAmount;
  final double discountAmount;
  final double totalAmount;
  final String status;
  final String paymentStatus;
  final String paymentMethod;
  final DateTime? paymentDueDate;
  final DateTime? orderDate;
  final DateTime? shipDate;
  final DateTime? deliveryDate;
  final DateTime? cancelledDate;
  final String trackingNumber;
  final String carrier;
  final String internalNotes;
  final String customerNotes;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Defines object properties
  @override
  List<Object?> get props => [
        id,
        orderNumber,
        customerId,
        shippingCompanyName,
        shippingAddress1,
        shippingAddress2,
        shippingCity,
        shippingState,
        shippingPostalCode,
        shippingCountry,
        shippingPhone,
        billingCompanyName,
        billingAddress1,
        billingAddress2,
        billingCity,
        billingState,
        billingPostalCode,
        billingCountry,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        totalAmount,
        status,
        paymentStatus,
        paymentMethod,
        paymentDueDate,
        orderDate,
        shipDate,
        deliveryDate,
        cancelledDate,
        trackingNumber,
        carrier,
        internalNotes,
        customerNotes,
        createdAt,
        updatedAt,
      ];

  // Helper function that converts a list of SQL objects to a list of our dart objects
  static List<Orders> converter(List<Map<String, dynamic>> data) {
    return data.map(Orders.fromJson).toList();
  }

  // Generic function to map our dart object to a JSON object
  Map<String, dynamic> toJson() {
    return _generateMap(
      id: id,
      orderNumber: orderNumber,
      customerId: customerId,
      shippingCompanyName: shippingCompanyName,
      shippingAddress1: shippingAddress1,
      shippingAddress2: shippingAddress2,
      shippingCity: shippingCity,
      shippingState: shippingState,
      shippingPostalCode: shippingPostalCode,
      shippingCountry: shippingCountry,
      shippingPhone: shippingPhone,
      billingCompanyName: billingCompanyName,
      billingAddress1: billingAddress1,
      billingAddress2: billingAddress2,
      billingCity: billingCity,
      billingState: billingState,
      billingPostalCode: billingPostalCode,
      billingCountry: billingCountry,
      subtotal: subtotal,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
      discountAmount: discountAmount,
      totalAmount: totalAmount,
      status: status,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      paymentDueDate: paymentDueDate,
      orderDate: orderDate,
      shipDate: shipDate,
      deliveryDate: deliveryDate,
      cancelledDate: cancelledDate,
      trackingNumber: trackingNumber,
      carrier: carrier,
      internalNotes: internalNotes,
      customerNotes: customerNotes,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // Generic function to generate a generic mapping between objects
  static Map<String, dynamic> _generateMap({
    String? id,
    String? orderNumber,
    String? customerId,
    String? shippingCompanyName,
    String? shippingAddress1,
    String? shippingAddress2,
    String? shippingCity,
    String? shippingState,
    String? shippingPostalCode,
    String? shippingCountry,
    String? shippingPhone,
    String? billingCompanyName,
    String? billingAddress1,
    String? billingAddress2,
    String? billingCity,
    String? billingState,
    String? billingPostalCode,
    String? billingCountry,
    double? subtotal,
    double? shippingCost,
    double? taxAmount,
    double? discountAmount,
    double? totalAmount,
    String? status,
    String? paymentStatus,
    String? paymentMethod,
    DateTime? paymentDueDate,
    DateTime? orderDate,
    DateTime? shipDate,
    DateTime? deliveryDate,
    DateTime? cancelledDate,
    String? trackingNumber,
    String? carrier,
    String? internalNotes,
    String? customerNotes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return {
      if (id != null) idConverter: id,
      if (orderNumber != null) orderNumberConverter: orderNumber,
      if (customerId != null) customerIdConverter: customerId,
      if (shippingCompanyName != null)
        shippingCompanyNameConverter: shippingCompanyName,
      if (shippingAddress1 != null) shippingAddress1Converter: shippingAddress1,
      if (shippingAddress2 != null) shippingAddress2Converter: shippingAddress2,
      if (shippingCity != null) shippingCityConverter: shippingCity,
      if (shippingState != null) shippingStateConverter: shippingState,
      if (shippingPostalCode != null)
        shippingPostalCodeConverter: shippingPostalCode,
      if (shippingCountry != null) shippingCountryConverter: shippingCountry,
      if (shippingPhone != null) shippingPhoneConverter: shippingPhone,
      if (billingCompanyName != null)
        billingCompanyNameConverter: billingCompanyName,
      if (billingAddress1 != null) billingAddress1Converter: billingAddress1,
      if (billingAddress2 != null) billingAddress2Converter: billingAddress2,
      if (billingCity != null) billingCityConverter: billingCity,
      if (billingState != null) billingStateConverter: billingState,
      if (billingPostalCode != null)
        billingPostalCodeConverter: billingPostalCode,
      if (billingCountry != null) billingCountryConverter: billingCountry,
      if (subtotal != null) subtotalConverter: subtotal,
      if (shippingCost != null) shippingCostConverter: shippingCost,
      if (taxAmount != null) taxAmountConverter: taxAmount,
      if (discountAmount != null) discountAmountConverter: discountAmount,
      if (totalAmount != null) totalAmountConverter: totalAmount,
      if (status != null) statusConverter: status,
      if (paymentStatus != null) paymentStatusConverter: paymentStatus,
      if (paymentMethod != null) paymentMethodConverter: paymentMethod,
      if (paymentDueDate != null)
        paymentDueDateConverter: paymentDueDate.toIso8601String(),
      if (orderDate != null) orderDateConverter: orderDate.toIso8601String(),
      if (shipDate != null) shipDateConverter: shipDate.toIso8601String(),
      if (deliveryDate != null)
        deliveryDateConverter: deliveryDate.toIso8601String(),
      if (cancelledDate != null)
        cancelledDateConverter: cancelledDate.toIso8601String(),
      if (trackingNumber != null) trackingNumberConverter: trackingNumber,
      if (carrier != null) carrierConverter: carrier,
      if (internalNotes != null) internalNotesConverter: internalNotes,
      if (customerNotes != null) customerNotesConverter: customerNotes,
      if (createdAt != null) createdAtConverter: createdAt.toIso8601String(),
      if (updatedAt != null) updatedAtConverter: updatedAt.toIso8601String(),
    };
  }
}

// Extensions to the object allowing a public getters
extension OrdersExtensions on Orders {
  // Check if object is currently empty
  bool get isEmpty => this == Orders.empty;
}
