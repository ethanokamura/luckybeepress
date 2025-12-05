import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
// import 'package:roommate_expense_tracker/features/create/create.dart';

enum NavBarItem { board, home, profile } // , demo

extension NavBarItemExtensions on NavBarItem {
  bool get isHome => this == NavBarItem.home;
}

final class NavBarController extends ChangeNotifier {
  NavBarController({NavBarItem initialItem = NavBarItem.home})
      : _item = initialItem,
        previousIndex = initialItem.index;

  NavBarItem _item;
  int previousIndex;

  NavBarItem get item => _item;

  set item(NavBarItem newItem) {
    if (_item != newItem) {
      previousIndex = _item.index;
      _item = newItem;
      notifyListeners();
    }
  }
}

class BottomNavBar extends AppWidget {
  const BottomNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    final navBarController = context.watch<NavBarController>();
    return AppBottomNav(
      onTap: (index) async {
        navBarController.item = NavBarItem.values[index];
      },
      currentIndex: context.select(
        (NavBarController controller) => controller.item.index,
      ),
      items: <AppBottomNavItem>[
        AppBottomNavItem(icon: Icons.mail_outline, label: 'Contact'),
        AppBottomNavItem(icon: Icons.home, label: 'Welcome'),
        AppBottomNavItem(icon: Icons.person, label: 'Profile'),
      ],
    );
  }
}
