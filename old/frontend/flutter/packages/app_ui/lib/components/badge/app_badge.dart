import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'badge_enums.dart';

/// A customizable badge component
class AppBadge extends AppWidget {
  const AppBadge({
    super.key,
    this.label,
    this.count,
    this.variant = BadgeVariant.filled,
    this.size = BadgeSize.medium,
    this.color,
    this.textColor,
    this.maxCount = 99,
    this.showZero = false,
    this.child,
    this.position = BadgePosition.topRight,
  });

  /// Create a dot badge (no label)
  const AppBadge.dot({
    super.key,
    this.color,
    this.size = BadgeSize.small,
    this.child,
    this.position = BadgePosition.topRight,
  })  : label = null,
        count = null,
        variant = BadgeVariant.dot,
        textColor = null,
        maxCount = 99,
        showZero = false;

  /// Create a count badge
  const AppBadge.count({
    super.key,
    required this.count,
    this.color,
    this.textColor,
    this.size = BadgeSize.medium,
    this.maxCount = 99,
    this.showZero = false,
    this.child,
    this.position = BadgePosition.topRight,
  })  : label = null,
        variant = BadgeVariant.filled;

  final String? label;
  final int? count;
  final BadgeVariant variant;
  final BadgeSize size;
  final Color? color;
  final Color? textColor;
  final int maxCount;
  final bool showZero;
  final Widget? child;
  final BadgePosition position;

  @override
  Widget build(BuildContext context) {
    if (child == null) {
      return _buildBadge(context);
    }

    // Don't show badge if count is 0 and showZero is false
    if (count != null && count! == 0 && !showZero) {
      return child!;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        child!,
        Positioned(
          top: position == BadgePosition.topRight ||
                  position == BadgePosition.topLeft
              ? -_getOffset()
              : null,
          bottom: position == BadgePosition.bottomRight ||
                  position == BadgePosition.bottomLeft
              ? -_getOffset()
              : null,
          right: position == BadgePosition.topRight ||
                  position == BadgePosition.bottomRight
              ? -_getOffset()
              : null,
          left: position == BadgePosition.topLeft ||
                  position == BadgePosition.bottomLeft
              ? -_getOffset()
              : null,
          child: _buildBadge(context),
        ),
      ],
    );
  }

  Widget _buildBadge(BuildContext context) {
    final badgeColor = color ?? colors(context).error;
    final badgeTextColor = textColor ?? Colors.white;

    if (variant.isDot) {
      return Container(
        width: _getDotSize(),
        height: _getDotSize(),
        decoration: BoxDecoration(
          color: badgeColor,
          shape: BoxShape.circle,
        ),
      );
    }

    final badgeText = _getBadgeText();

    return Container(
      padding: _getPadding(context),
      decoration: BoxDecoration(
        color: variant.isFilled ? badgeColor : Colors.transparent,
        border:
            variant.isOutlined ? Border.all(color: badgeColor, width: 1) : null,
        borderRadius: radius(context).borderFull,
      ),
      constraints: BoxConstraints(
        minWidth: _getMinWidth(),
        minHeight: _getMinHeight(),
      ),
      child: Center(
        child: Text(
          badgeText,
          style: TextStyle(
            fontSize: _getTextSize(context),
            fontWeight: typography(context).bold,
            color: variant.isFilled ? badgeTextColor : badgeColor,
            height: 1,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  String _getBadgeText() {
    if (label != null) return label!;
    if (count != null) {
      if (count! > maxCount) {
        return '$maxCount+';
      }
      return count.toString();
    }
    return '';
  }

  double _getDotSize() {
    return switch (size) {
      BadgeSize.small => 6.0,
      BadgeSize.medium => 8.0,
      BadgeSize.large => 10.0,
    };
  }

  double _getMinWidth() {
    return switch (size) {
      BadgeSize.small => 16.0,
      BadgeSize.medium => 20.0,
      BadgeSize.large => 24.0,
    };
  }

  double _getMinHeight() {
    return switch (size) {
      BadgeSize.small => 16.0,
      BadgeSize.medium => 20.0,
      BadgeSize.large => 24.0,
    };
  }

  EdgeInsets _getPadding(BuildContext context) {
    return switch (size) {
      BadgeSize.small => EdgeInsets.symmetric(
          horizontal: spacing(context).xxs,
          vertical: 2,
        ),
      BadgeSize.medium => EdgeInsets.symmetric(
          horizontal: spacing(context).xs,
          vertical: spacing(context).xxs,
        ),
      BadgeSize.large => EdgeInsets.symmetric(
          horizontal: spacing(context).xs,
          vertical: spacing(context).xs,
        ),
    };
  }

  double _getTextSize(BuildContext context) {
    return switch (size) {
      BadgeSize.small => typography(context).xs - 2,
      BadgeSize.medium => typography(context).xs,
      BadgeSize.large => typography(context).sm,
    };
  }

  double _getOffset() {
    return switch (size) {
      BadgeSize.small => 4.0,
      BadgeSize.medium => 6.0,
      BadgeSize.large => 8.0,
    };
  }
}
