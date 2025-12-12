import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:bento_labs/features/cart_items/cart_items.dart';
import 'package:bento_labs/features/cart_items/pages/create_cart_items.dart';
import 'package:bento_labs/features/cart_items/pages/edit_cart_items.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _cartItemsNavigatorKey = GlobalKey<NavigatorState>();

class CartItemsRouter {
  static const root = '/cart-items';
  static const create = '/cart-items/create';
  static const edit = '/cart-items/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _cartItemsNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => CartItemsCubit(
          repository: context.read<CartItemsRepository>(),
        )
          ..setFilters(
            sortBy: CartItems.createdAtConverter,
          )
          ..fetchCartItemsList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const CartItemsPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateCartItemsPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => CartItemsCubit(
              repository: context.read<CartItemsRepository>(),
            )..fetchCartItemsWithId(
                id: id,
              ),
            child: CartItemsCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditCartItemsPage(
                cartItems: state.cartItems,
              );
            }),
          );
        },
      ),
    ],
  );
}
