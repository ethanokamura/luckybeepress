import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'app_spacer.dart';

/// A convenience widget for adding gaps in Flex layouts (Row/Column)
/// This is similar to Flutter's Gap widget but uses theme spacing
class AppGap extends AppWidget {
  const AppGap(
    this.size, {
    super.key,
    this.customSize,
  });

  const AppGap.xs({super.key})
      : size = SpacingSize.xs,
        customSize = null;

  const AppGap.sm({super.key})
      : size = SpacingSize.sm,
        customSize = null;

  const AppGap.md({super.key})
      : size = SpacingSize.md,
        customSize = null;

  const AppGap.lg({super.key})
      : size = SpacingSize.lg,
        customSize = null;

  const AppGap.xl({super.key})
      : size = SpacingSize.xl,
        customSize = null;

  final SpacingSize size;
  final double? customSize;

  @override
  Widget build(BuildContext context) {
    final spaceSize = customSize ?? _getSpacingSize(context);

    return SizedBox(
      width: spaceSize,
      height: spaceSize,
    );
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

/// A Row with automatic gaps between children using Flutter's built-in spacing
class AppRow extends AppWidget {
  const AppRow({
    super.key,
    required this.children,
    this.gap = SpacingSize.md,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.mainAxisSize = MainAxisSize.max,
  });

  final List<Widget> children;
  final SpacingSize gap;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final MainAxisSize mainAxisSize;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: mainAxisAlignment,
      crossAxisAlignment: crossAxisAlignment,
      mainAxisSize: mainAxisSize,
      spacing: _getSpacingSize(context),
      children: children,
    );
  }

  double _getSpacingSize(BuildContext context) {
    final space = spacing(context);
    return switch (gap) {
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

/// A Column with automatic gaps between children using Flutter's built-in spacing
class AppColumn extends AppWidget {
  const AppColumn({
    super.key,
    required this.children,
    this.gap = SpacingSize.xxs,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.start,
    this.mainAxisSize = MainAxisSize.max,
  });
  final List<Widget> children;
  final SpacingSize gap;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final MainAxisSize mainAxisSize;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: mainAxisAlignment,
        crossAxisAlignment: crossAxisAlignment,
        mainAxisSize: mainAxisSize,
        spacing: _getSpacingSize(context),
        children: children,
      ),
    );
  }

  double _getSpacingSize(BuildContext context) {
    final space = spacing(context);
    return switch (gap) {
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
