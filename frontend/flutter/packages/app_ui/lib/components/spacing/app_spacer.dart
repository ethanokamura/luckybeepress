import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';

/// Spacing size enum
enum SpacingSize {
  xxs,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  xxxl;
}

/// A widget that adds vertical or horizontal space
class AppSpacer extends AppWidget {
  const AppSpacer({
    super.key,
    this.size = SpacingSize.md,
    this.direction = LayoutDirection.vertical,
    this.customSize,
  });

  /// Create a vertical spacer
  const AppSpacer.vertical({
    super.key,
    this.size = SpacingSize.md,
    this.customSize,
  }) : direction = LayoutDirection.vertical;

  /// Create a horizontal spacer
  const AppSpacer.horizontal({
    super.key,
    this.size = SpacingSize.md,
    this.customSize,
  }) : direction = LayoutDirection.horizontal;

  // Named constructors for common sizes
  const AppSpacer.xs({super.key, LayoutDirection? direction})
      : size = SpacingSize.xs,
        direction = direction ?? LayoutDirection.vertical,
        customSize = null;

  const AppSpacer.sm({super.key, LayoutDirection? direction})
      : size = SpacingSize.sm,
        direction = direction ?? LayoutDirection.vertical,
        customSize = null;

  const AppSpacer.md({super.key, LayoutDirection? direction})
      : size = SpacingSize.md,
        direction = direction ?? LayoutDirection.vertical,
        customSize = null;

  const AppSpacer.lg({super.key, LayoutDirection? direction})
      : size = SpacingSize.lg,
        direction = direction ?? LayoutDirection.vertical,
        customSize = null;

  const AppSpacer.xl({super.key, LayoutDirection? direction})
      : size = SpacingSize.xl,
        direction = direction ?? LayoutDirection.vertical,
        customSize = null;

  final SpacingSize size;
  final LayoutDirection direction;
  final double? customSize;

  @override
  Widget build(BuildContext context) {
    final spaceSize = customSize ?? _getSpacingSize(context);

    if (direction.isVertical) {
      return SizedBox(height: spaceSize);
    } else {
      return SizedBox(width: spaceSize);
    }
  }

  double _getSpacingSize(BuildContext context) {
    final space = spacing(context);
    return switch (size) {
      SpacingSize.xxs => space.xxs,
      SpacingSize.xs => space.xs,
      SpacingSize.sm => space.sm,
      SpacingSize.md => space.md,
      SpacingSize.lg => space.lg,
      SpacingSize.xl => space.xl,
      SpacingSize.xxl => space.xxl,
      SpacingSize.xxxl => space.xxxl,
    };
  }
}
