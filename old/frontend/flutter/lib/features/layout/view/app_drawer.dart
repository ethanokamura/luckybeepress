import 'package:app_ui/app_ui.dart';
import 'package:go_router/go_router.dart';

class AppDrawer extends AppWidget {
  const AppDrawer({
    this.semanticLabel = 'app-drawer',
    super.key,
  });
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    final List<String> pages = [
      'customers',
      'addresses',
      'products',
      'carts',
      'cart_items',
      'orders',
      'order_items',
    ];
    return Semantics(
      label: semanticLabel,
      button: true,
      child: Drawer(
        backgroundColor: context.colors.base100,
        elevation: 1,
        width: 200,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(0)),
        ),
        child: Padding(
          padding: EdgeInsetsGeometry.only(
            top: context.spacing.xxxl,
            left: context.spacing.md,
            right: context.spacing.md,
          ),
          child: AppColumn(
            gap: SpacingSize.md,
            children: [
              AppHeading.h2('Pages'),
              Semantics(
                label: 'home-page',
                child: GestureDetector(
                  onTap: () {
                    debugPrint('/');
                    Navigator.pop(context);
                    context.go(
                      '/',
                    );
                  },
                  child: AppText('Home'),
                ),
              ),
              ...List.generate(
                pages.length,
                (index) => Semantics(
                  label: '${pages[index].replaceAll('_', '-')}-page',
                  child: GestureDetector(
                    onTap: () {
                      Scaffold.of(context).closeDrawer();
                      context.push(
                        '/${pages[index].replaceAll('_', '-')}',
                      );
                    },
                    child: AppText(
                      pages[index].replaceAll('_', ' ').toTitleCase,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
