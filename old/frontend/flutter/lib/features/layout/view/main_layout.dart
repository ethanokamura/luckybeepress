import 'package:bento_labs/features/layout/view/app_drawer.dart';
import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'package:bento_labs/features/layout/view/bottom_nav_bar.dart';
import 'package:go_router/go_router.dart';

class MainLayout extends AppWidget {
  const MainLayout({
    required this.child,
    super.key,
  });
  final Widget child;
  @override
  Widget build(BuildContext context) {
    return ListenableProvider(
      create: (_) => NavBarController(),
      child: AppPage(
        title: 'BentoLabs',
        actions: [
          AppIconButton(
            semanticLabel: 'theme-button',
            onPressed: () => context.push('/settings'),
            icon: Icons.settings,
          ),
        ],
        centerTitle: false,
        drawer: AppDrawer(),
        body: child,
      ),
    );
  }
}
