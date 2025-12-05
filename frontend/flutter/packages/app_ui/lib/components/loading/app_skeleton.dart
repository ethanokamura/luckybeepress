import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// Skeleton loader shape
enum SkeletonShape {
  rectangle,
  circle,
  rounded;
}

/// A skeleton loader for content placeholders
class AppSkeleton extends AppWidget {
  const AppSkeleton({
    super.key,
    this.width,
    this.height = 16.0,
    this.shape = SkeletonShape.rounded,
    this.borderRadius,
  });

  final double? width;
  final double height;
  final SkeletonShape shape;
  final BorderRadius? borderRadius;

  /// Create a text skeleton
  const AppSkeleton.text({
    super.key,
    this.width,
    this.height = 16.0,
  })  : shape = SkeletonShape.rounded,
        borderRadius = null;

  /// Create a circular skeleton (avatar)
  const AppSkeleton.circle({
    super.key,
    required double size,
  })  : width = size,
        height = size,
        shape = SkeletonShape.circle,
        borderRadius = null;

  /// Create a rectangular skeleton
  const AppSkeleton.rectangle({
    super.key,
    this.width,
    required this.height,
  })  : shape = SkeletonShape.rectangle,
        borderRadius = null;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: colors(context).base300,
        shape: shape == SkeletonShape.circle
            ? BoxShape.circle
            : BoxShape.rectangle,
        borderRadius: _getBorderRadius(context),
      ),
      child: const _ShimmerAnimation(),
    );
  }

  BorderRadius? _getBorderRadius(BuildContext context) {
    if (shape == SkeletonShape.circle) return null;
    if (borderRadius != null) return borderRadius;

    return switch (shape) {
      SkeletonShape.rectangle => BorderRadius.zero,
      SkeletonShape.rounded => radius(context).borderSm,
      SkeletonShape.circle => null,
    };
  }
}

class _ShimmerAnimation extends StatefulWidget {
  const _ShimmerAnimation();

  @override
  State<_ShimmerAnimation> createState() => _ShimmerAnimationState();
}

class _ShimmerAnimationState extends State<_ShimmerAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();

    _animation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return ClipRect(
          child: Stack(
            children: [
              Positioned.fill(
                child: FractionallySizedBox(
                  widthFactor: 0.3,
                  alignment: Alignment(_animation.value, 0),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          Colors.white.withAlpha(77), // 30% opacity
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// A pre-built skeleton for list items
class AppSkeletonListItem extends AppWidget {
  const AppSkeletonListItem({
    super.key,
    this.showAvatar = true,
    this.showSubtitle = true,
    this.showTrailing = false,
  });

  final bool showAvatar;
  final bool showSubtitle;
  final bool showTrailing;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: spacing(context).allMd,
      child: Row(
        spacing: spacing(context).md,
        children: [
          if (showAvatar) const AppSkeleton.circle(size: 40),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: spacing(context).xs,
              children: [
                AppSkeleton(
                  height: 16,
                  width: MediaQuery.of(context).size.width * 0.4,
                ),
                if (showSubtitle)
                  AppSkeleton(
                    height: 14,
                    width: MediaQuery.of(context).size.width * 0.6,
                  ),
              ],
            ),
          ),
          if (showTrailing)
            const AppSkeleton(
              width: 60,
              height: 32,
            ),
        ],
      ),
    );
  }
}

/// A pre-built skeleton for card content
class AppSkeletonCard extends AppWidget {
  const AppSkeletonCard({
    super.key,
    this.lines = 3,
  });

  final int lines;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: spacing(context).allMd,
      decoration: BoxDecoration(
        color: colors(context).base100,
        borderRadius: radius(context).borderMd,
        border: Border.all(color: colors(context).base300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: spacing(context).sm,
        children: [
          AppSkeleton.rectangle(
            height: 200,
            width: double.infinity,
          ),
          SizedBox(height: spacing(context).xs),
          AppSkeleton(
            height: 20,
            width: MediaQuery.of(context).size.width * 0.7,
          ),
          ...List.generate(
            lines,
            (index) => AppSkeleton(
              height: 16,
              width: MediaQuery.of(context).size.width *
                  (index == lines - 1 ? 0.4 : 0.9),
            ),
          ),
        ],
      ),
    );
  }
}
