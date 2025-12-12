import 'package:app_ui/app_ui.dart';
import 'package:intl/intl.dart';

class WelcomePage extends AppWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final purchaseDate =
        DateFormat('E, MMM d').format(DateTime.now().toLocal());
    return AppList(
      child: AppColumn(
        gap: SpacingSize.sm,
        children: [
          AppHeading.h1(
            'Welcome To Your Starter Package!',
            textAlign: TextAlign.center,
          ),
          AppText(
            "You're all set! Your production-ready application starter code is ready to customize and deploy",
            textAlign: TextAlign.center,
            maxLines: 3,
          ),
          AppCard(
            child: AppRow(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppText.sm(
                      'Licensed To',
                      color: context.colors.baseSubContent,
                    ),
                    AppText.bold('Customer Name'),
                    AppSpacer.md(),
                    AppText.sm(
                      'Purchase Date',
                      color: context.colors.baseSubContent,
                    ),
                    AppText.bold(purchaseDate),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppText.sm(
                      'Licensed Type',
                      color: context.colors.baseSubContent,
                    ),
                    AppText.bold('Pro License'),
                    AppSpacer.md(),
                    AppText.sm(
                      'License Key',
                      color: context.colors.baseSubContent,
                    ),
                    AppText.bold(
                      'XXXX-XXXX-XXXX',
                      maxLines: 2,
                    ),
                  ],
                ),
              ],
            ),
          ),
          AppSpacer.lg(),
          AppRow(
            children: [
              Icon(
                Icons.check_circle,
                color: context.colors.success,
              ),
              AppHeading.h3('Included Features'),
            ],
          ),
          AppCard(
            child: AppColumn(
              children: [
                AppRow(
                  children: [
                    Icon(
                      Icons.lock,
                      color: context.colors.primary,
                    ),
                    AppText.bold(
                      'Complete Authentication System',
                      maxLines: 2,
                    ),
                  ],
                ),
                AppText.sm(
                  'Login, signup, password reset, email verification, and profile management all pre-built and ready to use.',
                  maxLines: 5,
                ),
              ],
            ),
          ),
          AppCard(
            child: AppColumn(
              children: [
                AppRow(
                  children: [
                    Icon(
                      Icons.handyman,
                      color: context.colors.primary,
                    ),
                    AppText.bold(
                      'Pre-built UI Components',
                      maxLines: 2,
                    ),
                  ],
                ),
                AppText.sm(
                  'Beautiful, accessible components including forms, tables, modals, and navigation.',
                  maxLines: 5,
                ),
              ],
            ),
          ),
          AppCard(
            child: AppColumn(
              children: [
                AppRow(
                  children: [
                    Icon(
                      Icons.data_array_outlined,
                      color: context.colors.primary,
                    ),
                    AppText.bold(
                      'Dynamic CRUD Operations',
                      maxLines: 2,
                    ),
                  ],
                ),
                AppText.sm(
                  'CRUD endpoints for every entity in the provided database schema.',
                  maxLines: 5,
                ),
              ],
            ),
          ),
          AppCard(
            child: AppColumn(
              children: [
                AppRow(
                  children: [
                    Icon(
                      Icons.science_outlined,
                      color: context.colors.primary,
                    ),
                    AppText.bold(
                      'E2E Testing',
                      maxLines: 2,
                    ),
                  ],
                ),
                AppText.sm(
                  'Full end-to-end testing for all included components. This includes the unit, integration, and state testing.',
                  maxLines: 5,
                ),
              ],
            ),
          ),
          AppSpacer.lg(),
          AppRow(
            children: [
              Icon(
                Icons.check_circle,
                color: context.colors.success,
              ),
              AppHeading.h3('Included Routes'),
            ],
          ),
          Center(
            child: AppTable(
              maxWidth: MediaQuery.widthOf(context) - (2 * context.spacing.md),
              tableHeaders: ['Page', 'Route'],
              rows: [
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Welcome'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Login'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/login'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Settings'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/settings'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Customers Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/customers'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create Customers'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/customers/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit Customers'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/customers/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Addresses Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/addresses'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create Addresses'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/addresses/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit Addresses'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/addresses/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Products Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/products'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create Products'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/products/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit Products'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/products/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Carts Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/carts'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create Carts'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/carts/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit Carts'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/carts/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('CartItems Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/cart-items'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create CartItems'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/cart-items/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit CartItems'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/cart-items/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Orders Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/orders'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create Orders'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/orders/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit Orders'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/orders/edit/:id'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('OrderItems Dashboard'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/order-items'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Create OrderItems'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/order-items/create'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    Padding(
                      padding: context.spacing.allXs,
                      child: AppText.sm('Edit OrderItems'),
                    ),
                    Padding(
                      padding: context.spacing.allXs,
                      child: RouteChip(route: '/order-items/edit/:id'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class RouteChip extends AppWidget {
  const RouteChip({required this.route, super.key});
  final String route;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: context.spacing.horizontalXs,
      decoration: BoxDecoration(
        borderRadius: context.radius.borderSm,
        color: context.colors.primary.withAlpha(50),
      ),
      child: AppText.sm(
        route,
        color: context.colors.primary,
      ),
    );
  }
}
