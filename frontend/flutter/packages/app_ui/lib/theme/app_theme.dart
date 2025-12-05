import 'tokens/colors.dart';
import 'tokens/typography.dart';
import 'tokens/spacing.dart';
import 'tokens/border_radius.dart';
import 'tokens/shadows.dart';
import 'tokens/sizing.dart';
import 'tokens/opacity.dart';
import 'tokens/durations.dart';

class AppTheme {
  const AppTheme({
    required this.colors,
    required this.typography,
    required this.spacing,
    required this.borderRadius,
    required this.shadows,
    required this.sizing,
    required this.opacity,
    required this.durations,
  });

  final AppColors colors;
  final AppTypography typography;
  final AppSpacing spacing;
  final AppBorderRadius borderRadius;
  final AppShadows shadows;
  final AppSizing sizing;
  final AppOpacity opacity;
  final AppDurations durations;

  // Factory for default light theme
  factory AppTheme.light() {
    return const AppTheme(
      colors: AppColors(),
      typography: AppTypography(),
      spacing: AppSpacing(),
      borderRadius: AppBorderRadius(),
      shadows: AppShadows(),
      sizing: AppSizing(),
      opacity: AppOpacity(),
      durations: AppDurations(),
    );
  }

  // Factory for dark theme
  factory AppTheme.dark() {
    return AppTheme(
      colors: AppColors.dark(),
      typography: const AppTypography(),
      spacing: const AppSpacing(),
      borderRadius: const AppBorderRadius(),
      shadows: const AppShadows(),
      sizing: const AppSizing(),
      opacity: const AppOpacity(),
      durations: const AppDurations(),
    );
  }
}
