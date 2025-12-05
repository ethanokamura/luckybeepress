import 'package:order_items_repository/order_items_repository.dart';
import 'package:bento_labs/features/order_items/order_items.dart';
import 'package:bento_labs/features/order_items/pages/create_order_items.dart';
import 'package:bento_labs/features/order_items/pages/edit_order_items.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _orderItemsNavigatorKey = GlobalKey<NavigatorState>();

class OrderItemsRouter {
  static const root = '/order-items';
  static const create = '/order-items/create';
  static const edit = '/order-items/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _orderItemsNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => OrderItemsCubit(
          repository: context.read<OrderItemsRepository>(),
        )
          ..setFilters(
            sortBy: OrderItems.createdAtConverter,
          )
          ..fetchOrderItemsList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const OrderItemsPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateOrderItemsPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => OrderItemsCubit(
              repository: context.read<OrderItemsRepository>(),
            )..fetchOrderItemsWithId(
                id: id,
              ),
            child: OrderItemsCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditOrderItemsPage(
                orderItems: state.orderItems,
              );
            }),
          );
        },
      ),
    ],
  );
}
