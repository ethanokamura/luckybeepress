import 'package:api_client/api_client.dart';
import 'package:credentials_repository/credentials_repository.dart';

import 'package:customers_repository/customers_repository.dart';
import 'package:addresses_repository/addresses_repository.dart';
import 'package:products_repository/products_repository.dart';
import 'package:carts_repository/carts_repository.dart';
import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:orders_repository/orders_repository.dart';
import 'package:order_items_repository/order_items_repository.dart';

final getIt = GetIt.instance;

void setupDependencies(
  Dio dioInstance,
  Auth0 auth0Instance,
  CacheManager cacheManagerInstance,
) {
  getIt.registerLazySingleton<Dio>(() => dioInstance);
  getIt.registerLazySingleton<Auth0>(() => auth0Instance);
  getIt.registerLazySingleton<CacheManager>(() => cacheManagerInstance);
  getIt.registerLazySingleton<CredentialsRepository>(
    () => CredentialsRepository(),
  );
  // Register all your repositories as lazy singletons
  getIt.registerLazySingleton<CustomersRepository>(
    () => CustomersRepository(),
  );
  getIt.registerLazySingleton<AddressesRepository>(
    () => AddressesRepository(),
  );
  getIt.registerLazySingleton<ProductsRepository>(
    () => ProductsRepository(),
  );
  getIt.registerLazySingleton<CartsRepository>(
    () => CartsRepository(),
  );
  getIt.registerLazySingleton<CartItemsRepository>(
    () => CartItemsRepository(),
  );
  getIt.registerLazySingleton<OrdersRepository>(
    () => OrdersRepository(),
  );
  getIt.registerLazySingleton<OrderItemsRepository>(
    () => OrderItemsRepository(),
  );
}
