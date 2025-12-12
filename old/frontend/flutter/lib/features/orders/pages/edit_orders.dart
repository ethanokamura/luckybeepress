import 'package:orders_repository/orders_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditOrdersPage extends AppStatefulWidget {
  const EditOrdersPage({
    required this.orders,
    super.key,
  });

  final Orders orders;

  @override
  State<EditOrdersPage> createState() => _EditOrdersPageState();
}

class _EditOrdersPageState extends State<EditOrdersPage> {
  late Map<String, dynamic> ordersData;

  @override
  void initState() {
    super.initState();
    ordersData = widget.orders.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'orders';
    return AppPage(
      title: 'Edit Orders',
      body: AppList(
        child: Column(
          children: [
            Center(
              child: AppTable(
                semanticLabel: '${table.replaceAll('_', '-')}-table',
                maxWidth:
                    MediaQuery.widthOf(context) - (2 * context.spacing.md),
                tableHeaders: ['Key', 'Value'],
                rows: [
                  TableRow(
                    key: ObjectKey('id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('order_number'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('order_number'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['order_number']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('customer_id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('customer_id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['customer_id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_company_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_company_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_company_name']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_address_1'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_address_1'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_address_1']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_address_2'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_address_2'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_address_2']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_city'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_city'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_city']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_state'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_state'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_state']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_postal_code'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_postal_code'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_postal_code']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_country'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_country'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_country']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_phone'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_phone'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_phone']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_company_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_company_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_company_name']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_address_1'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_address_1'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_address_1']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_address_2'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_address_2'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_address_2']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_city'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_city'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_city']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_state'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_state'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_state']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_postal_code'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_postal_code'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_postal_code']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('billing_country'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('billing_country'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['billing_country']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('subtotal'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('subtotal'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['subtotal']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('shipping_cost'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('shipping_cost'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['shipping_cost']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('tax_amount'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('tax_amount'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['tax_amount']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('discount_amount'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('discount_amount'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['discount_amount']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('total_amount'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('total_amount'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['total_amount']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('status'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('status'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['status']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('payment_status'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('payment_status'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['payment_status']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('payment_method'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('payment_method'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['payment_method']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('payment_due_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('payment_due_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['payment_due_date']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('order_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('order_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['order_date']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('ship_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('ship_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['ship_date']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('delivery_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('delivery_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['delivery_date']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('cancelled_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('cancelled_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['cancelled_date']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('tracking_number'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('tracking_number'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['tracking_number']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('carrier'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('carrier'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['carrier']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('internal_notes'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('internal_notes'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['internal_notes']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('customer_notes'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('customer_notes'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['customer_notes']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('created_at'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('created_at'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['created_at']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('updated_at'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('updated_at'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          ordersData['updated_at']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
