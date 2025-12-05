import 'package:carts_repository/carts_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditCartsPage extends AppStatefulWidget {
  const EditCartsPage({
    required this.carts,
    super.key,
  });

  final Carts carts;

  @override
  State<EditCartsPage> createState() => _EditCartsPageState();
}

class _EditCartsPageState extends State<EditCartsPage> {
  late Map<String, dynamic> cartsData;

  @override
  void initState() {
    super.initState();
    cartsData = widget.carts.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'carts';
    return AppPage(
      title: 'Edit Carts',
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
                          cartsData['id']?.toString() ?? 'N/A',
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
                          cartsData['customer_id']?.toString() ?? 'N/A',
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
                          cartsData['status']?.toString() ?? 'N/A',
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
                          cartsData['created_at']?.toString() ?? 'N/A',
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
                          cartsData['updated_at']?.toString() ?? 'N/A',
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
