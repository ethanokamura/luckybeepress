import 'package:customers_repository/customers_repository.dart';
import 'package:bento_labs/features/customers/customers.dart';
import 'package:bento_labs/features/customers/pages/create_customers.dart';
import 'package:bento_labs/features/customers/pages/edit_customers.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _customersNavigatorKey = GlobalKey<NavigatorState>();

class CustomersRouter {
  static const root = '/customers';
  static const create = '/customers/create';
  static const edit = '/customers/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _customersNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => CustomersCubit(
          repository: context.read<CustomersRepository>(),
        )
          ..setFilters(
            sortBy: Customers.createdAtConverter,
          )
          ..fetchCustomersList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const CustomersPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateCustomersPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => CustomersCubit(
              repository: context.read<CustomersRepository>(),
            )..fetchCustomersWithId(
                id: id,
              ),
            child: CustomersCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditCustomersPage(
                customers: state.customers,
              );
            }),
          );
        },
      ),
    ],
  );
}
