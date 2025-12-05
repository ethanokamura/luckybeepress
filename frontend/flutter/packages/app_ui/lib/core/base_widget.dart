import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../theme/theme_extension.dart';
import '../theme/tokens/colors.dart';
import '../theme/tokens/typography.dart';
import '../theme/tokens/spacing.dart';
import '../theme/tokens/border_radius.dart';
import '../theme/tokens/shadows.dart';
import '../theme/tokens/sizing.dart';
import '../theme/tokens/opacity.dart';
import '../theme/tokens/durations.dart';

/// Base class for all stateless UI components in the package
/// Provides quick access to theme tokens
abstract class AppWidget extends StatelessWidget {
  const AppWidget({super.key});

  /// Get the complete AppTheme
  @protected
  AppTheme theme(BuildContext context) => context.theme;

  /// Quick access to color tokens
  @protected
  AppColors colors(BuildContext context) => context.colors;

  /// Quick access to typography tokens
  @protected
  AppTypography typography(BuildContext context) => context.typography;

  /// Quick access to spacing tokens
  @protected
  AppSpacing spacing(BuildContext context) => context.spacing;

  /// Quick access to border radius tokens
  @protected
  AppBorderRadius radius(BuildContext context) => context.radius;

  /// Quick access to shadow tokens
  @protected
  AppShadows shadows(BuildContext context) => context.shadows;

  /// Quick access to sizing tokens
  @protected
  AppSizing sizing(BuildContext context) => context.sizing;

  /// Quick access to opacity tokens
  @protected
  AppOpacity opacity(BuildContext context) => context.opacity;

  /// Quick access to duration tokens
  @protected
  AppDurations durations(BuildContext context) => context.durations;
}

/// Base class for all stateful UI components in the package
/// Provides quick access to theme tokens
abstract class AppStatefulWidget extends StatefulWidget {
  const AppStatefulWidget({super.key});
}

/// Base state class for stateful widgets
abstract class AppState<T extends AppStatefulWidget> extends State<T> {
  /// Get the complete AppTheme
  @protected
  AppTheme get theme => context.theme;

  /// Quick access to color tokens
  @protected
  AppColors get colors => context.colors;

  /// Quick access to typography tokens
  @protected
  AppTypography get typography => context.typography;

  /// Quick access to spacing tokens
  @protected
  AppSpacing get spacing => context.spacing;

  /// Quick access to border radius tokens
  @protected
  AppBorderRadius get radius => context.radius;

  /// Quick access to shadow tokens
  @protected
  AppShadows get shadows => context.shadows;

  /// Quick access to sizing tokens
  @protected
  AppSizing get sizing => context.sizing;

  /// Quick access to opacity tokens
  @protected
  AppOpacity get opacity => context.opacity;

  /// Quick access to duration tokens
  @protected
  AppDurations get durations => context.durations;
}
