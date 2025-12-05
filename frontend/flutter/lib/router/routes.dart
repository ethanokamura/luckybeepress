import 'package:bento_labs/app/cubit/authentication_cubit.dart';
import 'package:bento_labs/features/auth/auth.dart';
import 'package:bento_labs/features/layout/layout.dart';
import 'package:bento_labs/features/settings/settings.dart';
import 'package:bento_labs/features/welcome/pages/welcome_page.dart';
import 'package:bento_labs/features/customers/customers.dart';
import 'package:bento_labs/features/addresses/addresses.dart';
import 'package:bento_labs/features/products/products.dart';
import 'package:bento_labs/features/carts/carts.dart';
import 'package:bento_labs/features/cart_items/cart_items.dart';
import 'package:bento_labs/features/orders/orders.dart';
import 'package:bento_labs/features/order_items/order_items.dart';
import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'router_stream.dart';

abstract final class Routes {
  static const home = '/';
  static const login = '/login';
  static const settings = '/settings';
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

GoRouter createRouter(AuthenticationCubit authCubit) => GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: Routes.home,
      refreshListenable: GoRouterRefreshStream(authCubit.stream),
      redirect: (BuildContext context, GoRouterState state) {
        final status = authCubit.state.status;
        final isLoggingIn = state.uri.toString() == Routes.login;
        if (status.isUnauthenticated && !isLoggingIn) return Routes.login;
        if (status.isAuthenticated && isLoggingIn) return Routes.home;
        return null;
      },
      routes: <RouteBase>[
        GoRoute(
          parentNavigatorKey: _rootNavigatorKey,
          path: Routes.login,
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          parentNavigatorKey: _rootNavigatorKey,
          path: Routes.settings,
          builder: (context, state) => const SettingsPage(),
        ),
        ShellRoute(
          navigatorKey: _shellNavigatorKey,
          builder: (context, state, child) {
            debugPrint(state.uri.toString());
            return MainLayout(child: child);
          },
          routes: [
            GoRoute(
              path: Routes.home,
              builder: (context, state) => const WelcomePage(),
            ),
          ],
        ),
        CustomersRouter.branches,
        AddressesRouter.branches,
        ProductsRouter.branches,
        CartsRouter.branches,
        CartItemsRouter.branches,
        OrdersRouter.branches,
        OrderItemsRouter.branches,
      ],
    );
