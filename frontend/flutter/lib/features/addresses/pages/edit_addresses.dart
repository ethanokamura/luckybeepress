import 'package:addresses_repository/addresses_repository.dart';
import 'package:app_ui/app_ui.dart';

class EditAddressesPage extends AppStatefulWidget {
  const EditAddressesPage({
    required this.addresses,
    super.key,
  });

  final Addresses addresses;

  @override
  State<EditAddressesPage> createState() => _EditAddressesPageState();
}

class _EditAddressesPageState extends State<EditAddressesPage> {
  late Map<String, dynamic> addressesData;

  @override
  void initState() {
    super.initState();
    addressesData = widget.addresses.toJson();
  }

  @override
  Widget build(BuildContext context) {
    const table = 'addresses';
    return AppPage(
      title: 'Edit Addresses',
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
                          addressesData['id']?.toString() ?? 'N/A',
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
                          addressesData['customer_id']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('address_type'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('address_type'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['address_type']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('is_default'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('is_default'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['is_default']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('company_name'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('company_name'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['company_name']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('street_address_1'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('street_address_1'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['street_address_1']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('street_address_2'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('street_address_2'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['street_address_2']?.toString() ??
                              'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('city'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('city'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['city']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('state'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('state'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['state']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('postal_code'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('postal_code'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['postal_code']?.toString() ?? 'N/A',
                        ),
                      ),
                    ],
                  ),
                  TableRow(
                    key: ObjectKey('country'),
                    children: [
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText('country'),
                      ),
                      Padding(
                        padding: context.spacing.allXs,
                        child: AppText(
                          addressesData['country']?.toString() ?? 'N/A',
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
                          addressesData['created_at']?.toString() ?? 'N/A',
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
                          addressesData['updated_at']?.toString() ?? 'N/A',
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
