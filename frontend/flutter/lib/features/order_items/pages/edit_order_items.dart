import 'package:order_items_repository/order_items_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditOrderItemsPage extends AppStatefulWidget {
  const EditOrderItemsPage({
    required this.orderItems,
    super.key,
  });

  final OrderItems orderItems;

  @override
  State<EditOrderItemsPage> createState() => _EditOrderItemsPageState();
}

class _EditOrderItemsPageState extends State<EditOrderItemsPage> {
  late Map<String, dynamic> orderItemsData;

  @override
  void initState() {
    super.initState();
    orderItemsData = widget.orderItems.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'order_items';
    return AppPage(
      title: 'Edit OrderItems',
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
                          orderItemsData['id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('order_id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('order_id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['order_id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('product_id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('product_id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['product_id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('sku'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('sku'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['sku']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('product_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('product_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['product_name']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('quantity'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('quantity'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['quantity']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('unit_wholesale_price'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('unit_wholesale_price'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['unit_wholesale_price']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('unit_retail_price'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('unit_retail_price'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          orderItemsData['unit_retail_price']?.toString() ??
                              'N/A',
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
                          orderItemsData['subtotal']?.toString() ?? 'N/A',
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
                          orderItemsData['status']?.toString() ?? 'N/A',
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
                          orderItemsData['created_at']?.toString() ?? 'N/A',
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
                          orderItemsData['updated_at']?.toString() ?? 'N/A',
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
