import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:order_items_repository/order_items_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class OrderItemsPage extends AppWidget {
  const OrderItemsPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'order_items';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'OrderItems',
      body: OrderItemsCubitWrapper(
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
                        key: ObjectKey('order_id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('order_id'),
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
                        key: ObjectKey('product_id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('product_id'),
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
                        key: ObjectKey('sku'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('sku'),
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
                        key: ObjectKey('product_name'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('product_name'),
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
                        key: ObjectKey('quantity'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('quantity'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('int'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('double'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
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
                            child: AppText('double'),
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
                    AppHeading.h3('OrderItems List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-order-items-list',
                          onPressed: () async =>
                              BlocProvider.of<OrderItemsCubit>(context)
                                  .fetchOrderItemsList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-order-items',
                          onPressed: () async =>
                              context.push('/order-items/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.orderItemsList.isEmpty)
                  AppText.sm('No order items yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.orderItemsList.length,
                  (index) => state.isLoading
                      ? SkeletonOrderItemsCard(key: ObjectKey(index.toString()))
                      : OrderItemsCard(
                          key: ObjectKey(state.orderItemsList[index].id),
                          orderItems: state.orderItemsList[index],
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

class OrderItemsCard extends AppWidget {
  const OrderItemsCard({required this.orderItems, super.key});
  final OrderItems orderItems;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(orderItems.id)),
          AppIconButton(
            semanticLabel: 'edit-order-items-${orderItems.id}',
            onPressed: () async => context.push(
              '/order-items/edit/${orderItems.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-order-items-${orderItems.id}',
            onPressed: () async => BlocProvider.of<OrderItemsCubit>(context)
                .deleteOrderItems(id: orderItems.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonOrderItemsCard extends AppWidget {
  const SkeletonOrderItemsCard({super.key});

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
