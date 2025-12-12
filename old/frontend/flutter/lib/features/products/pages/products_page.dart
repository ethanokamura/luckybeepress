import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:products_repository/products_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class ProductsPage extends AppWidget {
  const ProductsPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'products';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Products',
      body: ProductsCubitWrapper(
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
                        key: ObjectKey('name'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('name'),
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
                        key: ObjectKey('description'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('description'),
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
                        key: ObjectKey('category'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('category'),
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
                        key: ObjectKey('wholesale_price'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('wholesale_price'),
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
                        key: ObjectKey('suggested_retail_price'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('suggested_retail_price'),
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
                        key: ObjectKey('cost'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('cost'),
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
                        key: ObjectKey('is_active'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('is_active'),
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
                        key: ObjectKey('minimum_order_quantity'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('minimum_order_quantity'),
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
                        key: ObjectKey('stock_quantity'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('stock_quantity'),
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
                        key: ObjectKey('low_stock_threshold'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('low_stock_threshold'),
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
                        key: ObjectKey('image_url'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('image_url'),
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
                        key: ObjectKey('weight_oz'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('weight_oz'),
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
                    AppHeading.h3('Products List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-products-list',
                          onPressed: () async =>
                              BlocProvider.of<ProductsCubit>(context)
                                  .fetchProductsList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-products',
                          onPressed: () async =>
                              context.push('/products/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.productsList.isEmpty) AppText.sm('No products yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.productsList.length,
                  (index) => state.isLoading
                      ? SkeletonProductsCard(key: ObjectKey(index.toString()))
                      : ProductsCard(
                          key: ObjectKey(state.productsList[index].id),
                          products: state.productsList[index],
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

class ProductsCard extends AppWidget {
  const ProductsCard({required this.products, super.key});
  final Products products;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(products.id)),
          AppIconButton(
            semanticLabel: 'edit-products-${products.id}',
            onPressed: () async => context.push(
              '/products/edit/${products.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-products-${products.id}',
            onPressed: () async => BlocProvider.of<ProductsCubit>(context)
                .deleteProducts(id: products.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonProductsCard extends AppWidget {
  const SkeletonProductsCard({super.key});

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
