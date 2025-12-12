import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'package:bento_labs/theme/colors.dart';
import 'package:credentials_repository/credentials_repository.dart';
import 'package:go_router/go_router.dart';
import 'package:customers_repository/customers_repository.dart';
import 'package:addresses_repository/addresses_repository.dart';
import 'package:products_repository/products_repository.dart';
import 'package:carts_repository/carts_repository.dart';
import 'package:cart_items_repository/cart_items_repository.dart';
import 'package:orders_repository/orders_repository.dart';
import 'package:order_items_repository/order_items_repository.dart';
import '../cubit/authentication_cubit.dart';
import 'package:bento_labs/router/router.dart';

class App extends AppWidget {
  const App({
    required this.credentialsRepository,
    required this.customersRepository,
    required this.addressesRepository,
    required this.productsRepository,
    required this.cartsRepository,
    required this.cartItemsRepository,
    required this.ordersRepository,
    required this.orderItemsRepository,
    super.key,
  });

  final CredentialsRepository credentialsRepository;
  final CustomersRepository customersRepository;
  final AddressesRepository addressesRepository;
  final ProductsRepository productsRepository;
  final CartsRepository cartsRepository;
  final CartItemsRepository cartItemsRepository;
  final OrdersRepository ordersRepository;
  final OrderItemsRepository orderItemsRepository;

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider<CredentialsRepository>.value(
          value: credentialsRepository,
        ),
        RepositoryProvider<CustomersRepository>.value(
          value: customersRepository,
        ),
        RepositoryProvider<AddressesRepository>.value(
          value: addressesRepository,
        ),
        RepositoryProvider<ProductsRepository>.value(
          value: productsRepository,
        ),
        RepositoryProvider<CartsRepository>.value(
          value: cartsRepository,
        ),
        RepositoryProvider<CartItemsRepository>.value(
          value: cartItemsRepository,
        ),
        RepositoryProvider<OrdersRepository>.value(
          value: ordersRepository,
        ),
        RepositoryProvider<OrderItemsRepository>.value(
          value: orderItemsRepository,
        ),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<AuthenticationCubit>(
            create: (_) => AuthenticationCubit(
              credentialsRepository: credentialsRepository,
            ),
          ),
        ],
        child: const AppView(),
      ),
    );
  }
}

class AppView extends AppStatefulWidget {
  const AppView({super.key});

  @override
  State<AppView> createState() => _AppViewState();
}

class _AppViewState extends State<AppView> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = createRouter(BlocProvider.of<AuthenticationCubit>(context));
  }

  @override
  Widget build(BuildContext context) {
    return AppThemeScope(
      lightTheme: AppTheme(
          colors: lightMode,
          typography: AppTypography(),
          spacing: AppSpacing(),
          borderRadius: AppBorderRadius(),
          shadows: AppShadows(),
          sizing: AppSizing(),
          opacity: AppOpacity(),
          durations: AppDurations()),
      darkTheme: AppTheme(
        colors: darkMode,
        typography: AppTypography(),
        spacing: AppSpacing(),
        borderRadius: AppBorderRadius(),
        shadows: AppShadows(),
        sizing: AppSizing(),
        opacity: AppOpacity(),
        durations: AppDurations(),
      ),
      initialThemeMode: ThemeMode.light,
      child: Builder(
        builder: (context) {
          final currentTheme = AppThemeScope.of(context).theme;
          final isDarkMode = currentTheme.colors == AppColors.dark();
          return BlocListener<AuthenticationCubit, AuthenticationState>(
            listenWhen: (_, current) => current.isFailure,
            listener: (context, state) {
              if (state.isLoading) {
                AppSnackbar.show(context: context, message: 'Loading...');
              } else if (state.isAuthenticated) {
                AppSnackbar.show(context: context, message: 'Welcome!');
              } else if (state.isFailure) {
                final message = switch (state.failure) {
                  SignInFailure() => 'Failure to authenticate',
                  SignOutFailure() => 'Failure to sign out',
                  TokenFailure() => 'Failure gain access',
                  _ => 'Unknown failure occurred',
                };
                AppSnackbar.showError(context: context, message: message);
              }
            },
            child: BlocBuilder<AuthenticationCubit, AuthenticationState>(
              builder: (context, state) {
                return MaterialApp.router(
                  routerConfig: _router,
                  onGenerateTitle: (context) => context.l10n.appTitle,
                  localizationsDelegates: const [
                    AppLocalizations.delegate,
                    GlobalMaterialLocalizations.delegate,
                    GlobalWidgetsLocalizations.delegate,
                  ],
                  supportedLocales: AppLocalizations.supportedLocales,
                  debugShowCheckedModeBanner: false,
                  theme: ThemeData(
                    colorScheme: lightMode.toColorScheme(),
                    textTheme: context.typography.toTextTheme(),
                    useMaterial3: true,
                  ),
                  darkTheme: ThemeData(
                    colorScheme:
                        darkMode.toColorScheme(brightness: Brightness.dark),
                    textTheme: context.typography.toTextTheme(),
                    useMaterial3: true,
                  ),
                  themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
                );
              },
            ),
          );
        },
      ),
    );
  }
}
