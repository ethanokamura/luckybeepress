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
    this.animate = true,
  });

  final double? width;
  final double height;
  final SkeletonShape shape;
  final BorderRadius? borderRadius;
  final bool animate;

  /// Create a text skeleton
  const AppSkeleton.text({
    super.key,
    this.width,
    this.height = 16.0,
    this.animate = true,
  })  : shape = SkeletonShape.rounded,
        borderRadius = null;

  /// Create a circular skeleton (avatar)
  const AppSkeleton.circle({
    super.key,
    required double size,
    this.animate = true,
  })  : width = size,
        height = size,
        shape = SkeletonShape.circle,
        borderRadius = null;

  /// Create a rectangular skeleton
  const AppSkeleton.rectangle({
    super.key,
    this.width,
    required this.height,
    this.animate = true,
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
      child: animate ? const _ShimmerAnimation() : null,
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
    this.animate = true,
  });

  final bool showAvatar;
  final bool showSubtitle;
  final bool showTrailing;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: spacing(context).allMd,
      child: Row(
        spacing: spacing(context).md,
        children: [
          if (showAvatar) AppSkeleton.circle(size: 40, animate: animate),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: spacing(context).xs,
              children: [
                AppSkeleton(
                  height: 16,
                  width: MediaQuery.of(context).size.width * 0.4,
                  animate: animate,
                ),
                if (showSubtitle)
                  AppSkeleton(
                    height: 14,
                    width: MediaQuery.of(context).size.width * 0.6,
                    animate: animate,
                  ),
              ],
            ),
          ),
          if (showTrailing)
            AppSkeleton(
              width: 60,
              height: 32,
              animate: animate,
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
    this.showImage = true,
    this.animate = true,
  });

  final int lines;
  final bool showImage;
  final bool animate;

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
          if (showImage)
            AppSkeleton.rectangle(
              height: 200,
              width: double.infinity,
              animate: animate,
            ),
          if (showImage) SizedBox(height: spacing(context).xs),
          AppSkeleton(
            height: 20,
            width: MediaQuery.of(context).size.width * 0.7,
            animate: animate,
          ),
          ...List.generate(
            lines,
            (index) => AppSkeleton(
              height: 16,
              width: MediaQuery.of(context).size.width *
                  (index == lines - 1 ? 0.4 : 0.9),
              animate: animate,
            ),
          ),
        ],
      ),
    );
  }
}

/// A skeleton for a button
class AppSkeletonButton extends AppWidget {
  const AppSkeletonButton({
    super.key,
    this.width = 120,
    this.height = 40,
    this.animate = true,
  });

  final double width;
  final double height;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return AppSkeleton(
      width: width,
      height: height,
      shape: SkeletonShape.rounded,
      animate: animate,
    );
  }
}

/// A skeleton for text paragraph
class AppSkeletonParagraph extends AppWidget {
  const AppSkeletonParagraph({
    super.key,
    this.lines = 4,
    this.animate = true,
  });

  final int lines;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: spacing(context).xs,
      children: List.generate(
        lines,
        (index) => AppSkeleton(
          height: 16,
          width: index == lines - 1
              ? MediaQuery.of(context).size.width * 0.5
              : double.infinity,
          animate: animate,
        ),
      ),
    );
  }
}

/// A skeleton for a profile header
class AppSkeletonProfile extends AppWidget {
  const AppSkeletonProfile({
    super.key,
    this.showStats = true,
    this.animate = true,
  });

  final bool showStats;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: spacing(context).lg,
      children: [
        Row(
          spacing: spacing(context).md,
          children: [
            AppSkeleton.circle(size: 80, animate: animate),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: spacing(context).sm,
                children: [
                  AppSkeleton(
                    height: 24,
                    width: 150,
                    animate: animate,
                  ),
                  AppSkeleton(
                    height: 16,
                    width: 200,
                    animate: animate,
                  ),
                ],
              ),
            ),
          ],
        ),
        if (showStats)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(
              3,
              (index) => Column(
                spacing: spacing(context).xs,
                children: [
                  AppSkeleton(
                    height: 20,
                    width: 60,
                    animate: animate,
                  ),
                  AppSkeleton(
                    height: 14,
                    width: 40,
                    animate: animate,
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// A skeleton for a comment/message
class AppSkeletonComment extends AppWidget {
  const AppSkeletonComment({
    super.key,
    this.lines = 2,
    this.animate = true,
  });

  final int lines;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: spacing(context).md,
      children: [
        AppSkeleton.circle(size: 32, animate: animate),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: spacing(context).xs,
            children: [
              Row(
                spacing: spacing(context).sm,
                children: [
                  AppSkeleton(
                    height: 14,
                    width: 100,
                    animate: animate,
                  ),
                  AppSkeleton(
                    height: 12,
                    width: 60,
                    animate: animate,
                  ),
                ],
              ),
              ...List.generate(
                lines,
                (index) => AppSkeleton(
                  height: 14,
                  width: index == lines - 1
                      ? MediaQuery.of(context).size.width * 0.5
                      : double.infinity,
                  animate: animate,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// A skeleton for a table row
class AppSkeletonTableRow extends AppWidget {
  const AppSkeletonTableRow({
    super.key,
    this.columns = 4,
    this.animate = true,
  });

  final int columns;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: spacing(context).allMd,
      child: Row(
        spacing: spacing(context).md,
        children: List.generate(
          columns,
          (index) => Expanded(
            child: AppSkeleton(
              height: 16,
              animate: animate,
            ),
          ),
        ),
      ),
    );
  }
}

/// A skeleton for a grid item
class AppSkeletonGridItem extends AppWidget {
  const AppSkeletonGridItem({
    super.key,
    this.aspectRatio = 1.0,
    this.showTitle = true,
    this.showSubtitle = true,
    this.animate = true,
  });

  final double aspectRatio;
  final bool showTitle;
  final bool showSubtitle;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: spacing(context).sm,
      children: [
        AspectRatio(
          aspectRatio: aspectRatio,
          child: AppSkeleton.rectangle(
            height: double.infinity,
            width: double.infinity,
            animate: animate,
          ),
        ),
        if (showTitle)
          AppSkeleton(
            height: 16,
            width: double.infinity,
            animate: animate,
          ),
        if (showSubtitle)
          AppSkeleton(
            height: 14,
            width: MediaQuery.of(context).size.width * 0.6,
            animate: animate,
          ),
      ],
    );
  }
}

/// A skeleton for a form
class AppSkeletonForm extends AppWidget {
  const AppSkeletonForm({
    super.key,
    this.fields = 3,
    this.showButton = true,
    this.animate = true,
  });

  final int fields;
  final bool showButton;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: spacing(context).lg,
      children: [
        ...List.generate(
          fields,
          (index) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: spacing(context).xs,
            children: [
              AppSkeleton(
                height: 14,
                width: 80,
                animate: animate,
              ),
              AppSkeleton(
                height: 44,
                width: double.infinity,
                animate: animate,
              ),
            ],
          ),
        ),
        if (showButton)
          AppSkeletonButton(
            width: 120,
            height: 40,
            animate: animate,
          ),
      ],
    );
  }
}

/// A skeleton for a product card (e-commerce)
class AppSkeletonProductCard extends AppWidget {
  const AppSkeletonProductCard({
    super.key,
    this.showPrice = true,
    this.showRating = true,
    this.animate = true,
  });

  final bool showPrice;
  final bool showRating;
  final bool animate;

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
          AspectRatio(
            aspectRatio: 1.0,
            child: AppSkeleton.rectangle(
              height: double.infinity,
              width: double.infinity,
              animate: animate,
            ),
          ),
          AppSkeleton(
            height: 18,
            width: double.infinity,
            animate: animate,
          ),
          AppSkeleton(
            height: 14,
            width: MediaQuery.of(context).size.width * 0.6,
            animate: animate,
          ),
          if (showRating)
            Row(
              spacing: spacing(context).xs,
              children: List.generate(
                5,
                (index) => AppSkeleton.circle(
                  size: 16,
                  animate: animate,
                ),
              ),
            ),
          if (showPrice)
            AppSkeleton(
              height: 20,
              width: 80,
              animate: animate,
            ),
        ],
      ),
    );
  }
}

/// A skeleton for a news article preview
class AppSkeletonArticle extends AppWidget {
  const AppSkeletonArticle({
    super.key,
    this.showImage = true,
    this.lines = 2,
    this.animate = true,
  });

  final bool showImage;
  final int lines;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: spacing(context).md,
      children: [
        if (showImage)
          AppSkeleton.rectangle(
            height: 180,
            width: double.infinity,
            animate: animate,
          ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: spacing(context).xs,
          children: [
            AppSkeleton(
              height: 12,
              width: 100,
              animate: animate,
            ),
            AppSkeleton(
              height: 20,
              width: double.infinity,
              animate: animate,
            ),
            ...List.generate(
              lines,
              (index) => AppSkeleton(
                height: 14,
                width: index == lines - 1
                    ? MediaQuery.of(context).size.width * 0.7
                    : double.infinity,
                animate: animate,
              ),
            ),
          ],
        ),
        Row(
          spacing: spacing(context).sm,
          children: [
            AppSkeleton.circle(size: 24, animate: animate),
            AppSkeleton(
              height: 14,
              width: 100,
              animate: animate,
            ),
          ],
        ),
      ],
    );
  }
}

/// A full-page skeleton layout
class AppSkeletonPage extends AppWidget {
  const AppSkeletonPage({
    super.key,
    this.showHeader = true,
    this.itemCount = 5,
    this.animate = true,
  });

  final bool showHeader;
  final int itemCount;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (showHeader) ...[
          Padding(
            padding: spacing(context).allLg,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: spacing(context).md,
              children: [
                AppSkeleton(
                  height: 32,
                  width: 200,
                  animate: animate,
                ),
                AppSkeleton(
                  height: 16,
                  width: 300,
                  animate: animate,
                ),
              ],
            ),
          ),
          Divider(color: colors(context).base300),
        ],
        Expanded(
          child: ListView.separated(
            padding: spacing(context).allMd,
            itemCount: itemCount,
            separatorBuilder: (context, index) => SizedBox(
              height: spacing(context).md,
            ),
            itemBuilder: (context, index) => AppSkeletonListItem(
              animate: animate,
            ),
          ),
        ),
      ],
    );
  }
}
