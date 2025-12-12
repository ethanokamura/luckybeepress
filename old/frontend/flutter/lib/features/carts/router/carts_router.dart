import 'package:carts_repository/carts_repository.dart';
import 'package:bento_labs/features/carts/carts.dart';
import 'package:bento_labs/features/carts/pages/create_carts.dart';
import 'package:bento_labs/features/carts/pages/edit_carts.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _cartsNavigatorKey = GlobalKey<NavigatorState>();

class CartsRouter {
  static const root = '/carts';
  static const create = '/carts/create';
  static const edit = '/carts/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _cartsNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => CartsCubit(
          repository: context.read<CartsRepository>(),
        )
          ..setFilters(
            sortBy: Carts.createdAtConverter,
          )
          ..fetchCartsList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const CartsPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateCartsPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => CartsCubit(
              repository: context.read<CartsRepository>(),
            )..fetchCartsWithId(
                id: id,
              ),
            child: CartsCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditCartsPage(
                carts: state.carts,
              );
            }),
          );
        },
      ),
    ],
  );
}
