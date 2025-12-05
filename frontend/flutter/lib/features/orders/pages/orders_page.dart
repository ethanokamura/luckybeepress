import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:orders_repository/orders_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class OrdersPage extends AppWidget {
  const OrdersPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'orders';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Orders',
      body: OrdersCubitWrapper(
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
                        key: ObjectKey('order_number'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('order_number'),
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
                        key: ObjectKey('shipping_company_name'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_company_name'),
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
                        key: ObjectKey('shipping_address_1'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_address_1'),
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
                        key: ObjectKey('shipping_address_2'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_address_2'),
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
                        key: ObjectKey('shipping_city'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_city'),
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
                        key: ObjectKey('shipping_state'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_state'),
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
                        key: ObjectKey('shipping_postal_code'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_postal_code'),
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
                        key: ObjectKey('shipping_country'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_country'),
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
                        key: ObjectKey('shipping_phone'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('shipping_phone'),
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
                        key: ObjectKey('billing_company_name'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_company_name'),
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
                        key: ObjectKey('billing_address_1'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_address_1'),
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
                        key: ObjectKey('billing_address_2'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_address_2'),
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
                        key: ObjectKey('billing_city'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_city'),
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
                        key: ObjectKey('billing_state'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_state'),
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
                        key: ObjectKey('billing_postal_code'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_postal_code'),
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
                        key: ObjectKey('billing_country'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('billing_country'),
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
                        key: ObjectKey('subtotal'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('subtotal'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
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
                    AppHeading.h3('Orders List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-orders-list',
                          onPressed: () async =>
                              BlocProvider.of<OrdersCubit>(context)
                                  .fetchOrdersList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-orders',
                          onPressed: () async => context.push('/orders/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.ordersList.isEmpty) AppText.sm('No orders yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.ordersList.length,
                  (index) => state.isLoading
                      ? SkeletonOrdersCard(key: ObjectKey(index.toString()))
                      : OrdersCard(
                          key: ObjectKey(state.ordersList[index].id),
                          orders: state.ordersList[index],
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

class OrdersCard extends AppWidget {
  const OrdersCard({required this.orders, super.key});
  final Orders orders;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(orders.id)),
          AppIconButton(
            semanticLabel: 'edit-orders-${orders.id}',
            onPressed: () async => context.push(
              '/orders/edit/${orders.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-orders-${orders.id}',
            onPressed: () async => BlocProvider.of<OrdersCubit>(context)
                .deleteOrders(id: orders.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonOrdersCard extends AppWidget {
  const SkeletonOrdersCard({super.key});

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
