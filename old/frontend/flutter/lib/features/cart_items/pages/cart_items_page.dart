import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class CartItemsPage extends AppWidget {
  const CartItemsPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'cart_items';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'CartItems',
      body: CartItemsCubitWrapper(
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
                        key: ObjectKey('cart_id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('cart_id'),
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
                        key: ObjectKey('unit_price'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('unit_price'),
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
                    AppHeading.h3('CartItems List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-cart-items-list',
                          onPressed: () async =>
                              BlocProvider.of<CartItemsCubit>(context)
                                  .fetchCartItemsList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-cart-items',
                          onPressed: () async =>
                              context.push('/cart-items/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.cartItemsList.isEmpty)
                  AppText.sm('No cart items yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.cartItemsList.length,
                  (index) => state.isLoading
                      ? SkeletonCartItemsCard(key: ObjectKey(index.toString()))
                      : CartItemsCard(
                          key: ObjectKey(state.cartItemsList[index].id),
                          cartItems: state.cartItemsList[index],
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

class CartItemsCard extends AppWidget {
  const CartItemsCard({required this.cartItems, super.key});
  final CartItems cartItems;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(cartItems.id)),
          AppIconButton(
            semanticLabel: 'edit-cart-items-${cartItems.id}',
            onPressed: () async => context.push(
              '/cart-items/edit/${cartItems.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-cart-items-${cartItems.id}',
            onPressed: () async => BlocProvider.of<CartItemsCubit>(context)
                .deleteCartItems(id: cartItems.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonCartItemsCard extends AppWidget {
  const SkeletonCartItemsCard({super.key});

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
