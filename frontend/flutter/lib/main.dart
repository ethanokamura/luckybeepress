import 'package:api_client/api_client.dart';
import 'package:app_core/app_core.dart';
import 'package:credentials_repository/credentials_repository.dart';
import 'package:bento_labs/app/app.dart';
import 'package:customers_repository/customers_repository.dart';
import 'package:addresses_repository/addresses_repository.dart';
import 'package:products_repository/products_repository.dart';
import 'package:carts_repository/carts_repository.dart';
import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:orders_repository/orders_repository.dart';
import 'package:order_items_repository/order_items_repository.dart';
import 'config/config.dart';

Future<void> main() async {
  try {
    await bootstrap(
      init: () async {
        try {
          final CacheManager cacheManager = CacheManager();
          await cacheManager.init();
          final auth0 = Auth0(
            ApiConfig.auth0Domain,
            ApiConfig.auth0ClientId,
          );
          final dioInstance = Dio(
            BaseOptions(
              baseUrl: ApiConfig.apiEndpointUrl,
              connectTimeout: const Duration(seconds: 10),
              receiveTimeout: const Duration(seconds: 30),
            ),
          );
          setupDependencies(dioInstance, auth0, cacheManager);
          dioInstance.interceptors.add(
            AuthInterceptor(
              credentialsRepository: GetIt.instance<CredentialsRepository>(),
              onSignOut: () async {
                await GetIt.instance<CredentialsRepository>().logout();
              },
            ),
          );
          await getIt<CacheManager>().cleanupAllCaches();
        } catch (e) {
          throw Exception('App initialization error: $e');
        }
      },
      builder: () async {
        final credentialsRepository = CredentialsRepository();
        await credentialsRepository.verifyAuthentication();
        final customersRepository = CustomersRepository();
        final addressesRepository = AddressesRepository();
        final productsRepository = ProductsRepository();
        final cartsRepository = CartsRepository();
        final cartItemsRepository = CartItemsRepository();
        final ordersRepository = OrdersRepository();
        final orderItemsRepository = OrderItemsRepository();
        return App(
          credentialsRepository: credentialsRepository,
          customersRepository: customersRepository,
          addressesRepository: addressesRepository,
          productsRepository: productsRepository,
          cartsRepository: cartsRepository,
          cartItemsRepository: cartItemsRepository,
          ordersRepository: ordersRepository,
          orderItemsRepository: orderItemsRepository,
        );
      },
    );
  } catch (e) {
    throw Exception('Fatal error during bootstrap: $e');
  }
}
