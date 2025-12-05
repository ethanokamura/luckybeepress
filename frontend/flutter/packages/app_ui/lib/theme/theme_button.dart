import 'package:app_ui/app_ui.dart';

class ThemeToggleButton extends StatelessWidget {
  const ThemeToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.brightness_6),
      onPressed: () {
        // Toggle theme
        AppThemeScope.of(context).toggleTheme();
      },
    );
  }
}
