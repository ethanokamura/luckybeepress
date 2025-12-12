import 'package:customers_repository/customers_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditCustomersPage extends AppStatefulWidget {
  const EditCustomersPage({
    required this.customers,
    super.key,
  });

  final Customers customers;

  @override
  State<EditCustomersPage> createState() => _EditCustomersPageState();
}

class _EditCustomersPageState extends State<EditCustomersPage> {
  late Map<String, dynamic> customersData;

  @override
  void initState() {
    super.initState();
    customersData = widget.customers.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'customers';
    return AppPage(
      title: 'Edit Customers',
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
                          customersData['id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('business_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('business_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['business_name']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('contact_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('contact_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['contact_name']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('email'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('email'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['email']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('phone'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('phone'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['phone']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('tax_id'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('tax_id'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['tax_id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('account_status'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('account_status'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['account_status']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('net_terms'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('net_terms'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['net_terms']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('discount_percentage'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('discount_percentage'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['discount_percentage']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('first_order_date'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('first_order_date'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['first_order_date']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('total_orders'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('total_orders'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['total_orders']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('lifetime_value'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('lifetime_value'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['lifetime_value']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('notes'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('notes'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          customersData['notes']?.toString() ?? 'N/A',
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
                          customersData['created_at']?.toString() ?? 'N/A',
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
                          customersData['updated_at']?.toString() ?? 'N/A',
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
