import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:addresses_repository/addresses_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class AddressesPage extends AppWidget {
  const AddressesPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'addresses';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Addresses',
      body: AddressesCubitWrapper(
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
                        key: ObjectKey('customer_id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('customer_id'),
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
                        key: ObjectKey('address_type'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('address_type'),
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
                        key: ObjectKey('is_default'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('is_default'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('bool'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                    AppHeading.h3('Addresses List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-addresses-list',
                          onPressed: () async =>
                              BlocProvider.of<AddressesCubit>(context)
                                  .fetchAddressesList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-addresses',
                          onPressed: () async =>
                              context.push('/addresses/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.addressesList.isEmpty) AppText.sm('No addresses yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.addressesList.length,
                  (index) => state.isLoading
                      ? SkeletonAddressesCard(key: ObjectKey(index.toString()))
                      : AddressesCard(
                          key: ObjectKey(state.addressesList[index].id),
                          addresses: state.addressesList[index],
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

class AddressesCard extends AppWidget {
  const AddressesCard({required this.addresses, super.key});
  final Addresses addresses;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(addresses.id)),
          AppIconButton(
            semanticLabel: 'edit-addresses-${addresses.id}',
            onPressed: () async => context.push(
              '/addresses/edit/${addresses.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-addresses-${addresses.id}',
            onPressed: () async => BlocProvider.of<AddressesCubit>(context)
                .deleteAddresses(id: addresses.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonAddressesCard extends AppWidget {
  const SkeletonAddressesCard({super.key});

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
