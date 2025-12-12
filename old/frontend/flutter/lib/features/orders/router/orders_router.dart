import 'package:orders_repository/orders_repository.dart';
import 'package:bento_labs/features/orders/orders.dart';
import 'package:bento_labs/features/orders/pages/create_orders.dart';
import 'package:bento_labs/features/orders/pages/edit_orders.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _ordersNavigatorKey = GlobalKey<NavigatorState>();

class OrdersRouter {
  static const root = '/orders';
  static const create = '/orders/create';
  static const edit = '/orders/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _ordersNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => OrdersCubit(
          repository: context.read<OrdersRepository>(),
        )
          ..setFilters(
            sortBy: Orders.createdAtConverter,
          )
          ..fetchOrdersList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const OrdersPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateOrdersPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => OrdersCubit(
              repository: context.read<OrdersRepository>(),
            )..fetchOrdersWithId(
                id: id,
              ),
            child: OrdersCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditOrdersPage(
                orders: state.orders,
              );
            }),
          );
        },
      ),
    ],
  );
}
