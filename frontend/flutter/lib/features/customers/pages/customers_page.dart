import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:customers_repository/customers_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class CustomersPage extends AppWidget {
  const CustomersPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'customers';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Customers',
      body: CustomersCubitWrapper(
        builder: (context, state) {
          return AppList(
            child: AppColumn(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppHeading.h2(
                  '${table.replaceAll('_', ' ').toTitleCase} Data',
                ),
                Center(
                  child: AppTable(
                    semanticLabel: '${table.replaceAll('_', '-')}-table',
                    maxWidth:
                        MediaQuery.widthOf(context) - (2 * context.spacing.md),
                    tableHeaders: ['Key', 'Value', 'Nullable'],
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('int'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('int'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                AppSpacer(),
                AppRow(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    AppHeading.h3('Customers List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-customers-list',
                          onPressed: () async =>
                              BlocProvider.of<CustomersCubit>(context)
                                  .fetchCustomersList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-customers',
                          onPressed: () async =>
                              context.push('/customers/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.customersList.isEmpty) AppText.sm('No customers yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.customersList.length,
                  (index) => state.isLoading
                      ? SkeletonCustomersCard(key: ObjectKey(index.toString()))
                      : CustomersCard(
                          key: ObjectKey(state.customersList[index].id),
                          customers: state.customersList[index],
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class CustomersCard extends AppWidget {
  const CustomersCard({required this.customers, super.key});
  final Customers customers;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(customers.id)),
          AppIconButton(
            semanticLabel: 'edit-customers-${customers.id}',
            onPressed: () async => context.push(
              '/customers/edit/${customers.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-customers-${customers.id}',
            onPressed: () async => BlocProvider.of<CustomersCubit>(context)
                .deleteCustomers(id: customers.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonCustomersCard extends AppWidget {
  const SkeletonCustomersCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText('unknown user')),
          AppIconButton(
            onPressed: () {},
            icon: Icons.delete_forever_rounded,
          )
        ],
      ),
    );
  }
}
