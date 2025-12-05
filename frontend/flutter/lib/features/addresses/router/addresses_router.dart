import 'package:addresses_repository/addresses_repository.dart';
import 'package:bento_labs/features/addresses/addresses.dart';
import 'package:bento_labs/features/addresses/pages/create_addresses.dart';
import 'package:bento_labs/features/addresses/pages/edit_addresses.dart';
import 'package:app_core/app_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _addressesNavigatorKey = GlobalKey<NavigatorState>();

class AddressesRouter {
  static const root = '/addresses';
  static const create = '/addresses/create';
  static const edit = '/addresses/edit/:id';

  static final branches = ShellRoute(
    navigatorKey: _addressesNavigatorKey,
    builder: (context, state, child) {
      debugPrint(state.uri.toString());
      return BlocProvider(
        create: (context) => AddressesCubit(
          repository: context.read<AddressesRepository>(),
        )
          ..setFilters(
            sortBy: Addresses.createdAtConverter,
          )
          ..fetchAddressesList(
            pageNumber: 0,
          ),
        child: child,
      );
    },
    routes: [
      GoRoute(
        path: root,
        builder: (context, state) => const AddressesPage(),
      ),
      GoRoute(
        path: create,
        builder: (context, state) => const CreateAddressesPage(),
      ),
      GoRoute(
        path: edit,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BlocProvider(
            create: (context) => AddressesCubit(
              repository: context.read<AddressesRepository>(),
            )..fetchAddressesWithId(
                id: id,
              ),
            child: AddressesCubitWrapper(builder: (context, state) {
              if (state.isLoading) {
                return Center(child: CircularProgressIndicator());
              }
              return EditAddressesPage(
                addresses: state.addresses,
              );
            }),
          );
        },
      ),
    ],
  );
}
