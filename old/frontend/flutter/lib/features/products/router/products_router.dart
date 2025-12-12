import 'package:products_repository/products_repository.dart';
import 'package:bento_labs/features/products/products.dart';
import 'package:bento_labs/features/products/pages/create_products.dart';
import 'package:bento_labs/features/products/pages/edit_products.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _productsNavigatorKey = GlobalKey<NavigatorState>();

class ProductsRouter {
  static const root = '/products';
  static const create = '/products/create';
  static const edit = '/products/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _productsNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => ProductsCubit(
          repository: context.read<ProductsRepository>(),
        )
          ..setFilters(
            sortBy: Products.createdAtConverter,
          )
          ..fetchProductsList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const ProductsPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateProductsPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => ProductsCubit(
              repository: context.read<ProductsRepository>(),
            )..fetchProductsWithId(
                id: id,
              ),
            child: ProductsCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditProductsPage(
                products: state.products,
              );
            }),
          );
        },
      ),
    ],
  );
}
