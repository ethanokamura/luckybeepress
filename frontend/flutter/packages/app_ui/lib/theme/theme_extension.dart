import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'theme_provider.dart';
import 'tokens/colors.dart';
import 'tokens/typography.dart';
import 'tokens/spacing.dart';
import 'tokens/border_radius.dart';
import 'tokens/shadows.dart';
import 'tokens/sizing.dart';
import 'tokens/opacity.dart';
import 'tokens/durations.dart';

extension BuildContextExtensions on BuildContext {
  void popUntil(RoutePredicate predicate) =>
      Navigator.of(this).popUntil(predicate);
}

// Custom Clipper to clip only the top
class TopClipper extends CustomClipper<Rect> {
  @override
  Rect getClip(Size size) {
    return Rect.fromLTWH(0.0, 0.0, size.width, size.height);
  }

  @override
  bool shouldReclip(covariant CustomClipper<Rect> oldClipper) {
    return false;
  }
}

extension StringCasingExtension on String {
  String get toCapitalized =>
      length > 0 ? '${this[0].toUpperCase()}${substring(1)}' : '';
  String get toTitleCase => replaceAll(RegExp(' +'), ' ')
      .split(' ')
      .map((str) => str.toCapitalized)
      .join(' ');
}

/// Extension on BuildContext to easily access theme tokens
extension ThemeContext on BuildContext {
  /// Access the complete AppTheme
  AppTheme get theme => AppThemeProvider.of(this);

  /// Quick access to color tokens
  AppColors get colors => theme.colors;

  /// Quick access to typography tokens
  AppTypography get typography => theme.typography;

  /// Quick access to spacing tokens
  AppSpacing get spacing => theme.spacing;

  /// Quick access to border radius tokens
  AppBorderRadius get radius => theme.borderRadius;

  /// Quick access to shadow tokens
  AppShadows get shadows => theme.shadows;

  /// Quick access to sizing tokens
  AppSizing get sizing => theme.sizing;

  /// Quick access to opacity tokens
  AppOpacity get opacity => theme.opacity;

  /// Quick access to duration tokens
  AppDurations get durations => theme.durations;
}

/// Extension on BuildContext for common Material theme access
extension MaterialThemeContext on BuildContext {
  /// Access Material ThemeData
  ThemeData get materialTheme => Theme.of(this);

  /// Access Material ColorScheme
  ColorScheme get colorScheme => materialTheme.colorScheme;

  /// Access Material TextTheme
  TextTheme get textTheme => materialTheme.textTheme;
}
