import 'package:products_repository/products_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditProductsPage extends AppStatefulWidget {
  const EditProductsPage({
    required this.products,
    super.key,
  });

  final Products products;

  @override
  State<EditProductsPage> createState() => _EditProductsPageState();
}

class _EditProductsPageState extends State<EditProductsPage> {
  late Map<String, dynamic> productsData;

  @override
  void initState() {
    super.initState();
    productsData = widget.products.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'products';
    return AppPage(
      title: 'Edit Products',
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
                          productsData['id']?.toString() ?? 'N/A',
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
                          productsData['sku']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['name']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('description'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('description'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['description']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('category'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('category'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['category']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('wholesale_price'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('wholesale_price'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['wholesale_price']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('suggested_retail_price'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('suggested_retail_price'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['suggested_retail_price']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('cost'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('cost'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['cost']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('is_active'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('is_active'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['is_active']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('minimum_order_quantity'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('minimum_order_quantity'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['minimum_order_quantity']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('stock_quantity'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('stock_quantity'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['stock_quantity']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('low_stock_threshold'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('low_stock_threshold'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['low_stock_threshold']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('image_url'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('image_url'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['image_url']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('weight_oz'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('weight_oz'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          productsData['weight_oz']?.toString() ?? 'N/A',
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
                          productsData['created_at']?.toString() ?? 'N/A',
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
                          productsData['updated_at']?.toString() ?? 'N/A',
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
