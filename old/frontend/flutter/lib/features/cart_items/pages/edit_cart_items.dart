import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditCartItemsPage extends AppStatefulWidget {
  const EditCartItemsPage({
    required this.cartItems,
    super.key,
  });

  final CartItems cartItems;

  @override
  State<EditCartItemsPage> createState() => _EditCartItemsPageState();
}

class _EditCartItemsPageState extends State<EditCartItemsPage> {
  late Map<String, dynamic> cartItemsData;

  @override
  void initState() {
    super.initState();
    cartItemsData = widget.cartItems.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'cart_items';
    return AppPage(
      title: 'Edit CartItems',
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
                          cartItemsData['id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('cart_id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('cart_id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          cartItemsData['cart_id']?.toString() ?? 'N/A',
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
                          cartItemsData['product_id']?.toString() ?? 'N/A',
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
                          cartItemsData['quantity']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('unit_price'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('unit_price'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          cartItemsData['unit_price']?.toString() ?? 'N/A',
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
                          cartItemsData['created_at']?.toString() ?? 'N/A',
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
                          cartItemsData['updated_at']?.toString() ?? 'N/A',
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
