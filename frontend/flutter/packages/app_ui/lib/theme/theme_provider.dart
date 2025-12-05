import 'package:flutter/material.dart';
import 'app_theme.dart';

/// Provides AppTheme to the widget tree using InheritedWidget
class AppThemeProvider extends InheritedWidget {
  const AppThemeProvider({
    super.key,
    required this.theme,
    required super.child,
  });

  final AppTheme theme;

  /// Access the AppTheme from any BuildContext
  static AppTheme of(BuildContext context) {
    final provider =
        context.dependOnInheritedWidgetOfExactType<AppThemeProvider>();
    assert(provider != null, 'No AppThemeProvider found in context');
    return provider!.theme;
  }

  /// Check if AppThemeProvider exists in the widget tree
  static AppTheme? maybeOf(BuildContext context) {
    final provider =
        context.dependOnInheritedWidgetOfExactType<AppThemeProvider>();
    return provider?.theme;
  }

  @override
  bool updateShouldNotify(AppThemeProvider oldWidget) {
    return theme != oldWidget.theme;
  }
}

/// Stateful wrapper for AppThemeProvider that allows theme switching
class AppThemeScope extends StatefulWidget {
  const AppThemeScope({
    super.key,
    required this.lightTheme,
    required this.darkTheme,
    this.initialThemeMode = ThemeMode.light,
    required this.child,
  });

  final AppTheme lightTheme;
  final AppTheme darkTheme;
  final ThemeMode initialThemeMode;
  final Widget child;

  @override
  State<AppThemeScope> createState() => AppThemeScopeState();

  /// Access the state to change theme
  static AppThemeScopeState of(BuildContext context) {
    final state = context.findAncestorStateOfType<AppThemeScopeState>();
    assert(state != null, 'No AppThemeScope found in context');
    return state!;
  }

  /// Maybe access the state to change theme
  static AppThemeScopeState? maybeOf(BuildContext context) {
    return context.findAncestorStateOfType<AppThemeScopeState>();
  }
}

class AppThemeScopeState extends State<AppThemeScope> {
  late ThemeMode _themeMode;

  @override
  void initState() {
    super.initState();
    _themeMode = widget.initialThemeMode;
  }

  /// Current theme mode
  ThemeMode get themeMode => _themeMode;

  /// Check if currently in dark mode
  bool get isDarkMode => _themeMode == ThemeMode.dark;

  /// Current theme based on mode
  AppTheme get theme => isDarkMode ? widget.darkTheme : widget.lightTheme;

  /// Update the theme mode
  void setThemeMode(ThemeMode mode) {
    if (_themeMode != mode) {
      setState(() {
        _themeMode = mode;
      });
    }
  }

  /// Toggle between light and dark theme
  void toggleTheme() {
    setState(() {
      _themeMode =
          _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  /// Set to light theme
  void setLightTheme() {
    setThemeMode(ThemeMode.light);
  }

  /// Set to dark theme
  void setDarkTheme() {
    setThemeMode(ThemeMode.dark);
  }

  @override
  Widget build(BuildContext context) {
    return AppThemeProvider(
      theme: theme,
      child: widget.child,
    );
  }
}
