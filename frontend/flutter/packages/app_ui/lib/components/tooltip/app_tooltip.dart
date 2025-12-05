import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// Tooltip position
enum TooltipPosition {
  top,
  bottom,
  left,
  right;
}

/// A customizable tooltip component
class AppTooltip extends AppWidget {
  const AppTooltip({
    super.key,
    required this.message,
    required this.child,
    this.richMessage,
    this.position = TooltipPosition.top,
    this.showDuration = const Duration(seconds: 2),
    this.waitDuration = const Duration(milliseconds: 500),
    this.backgroundColor,
    this.textColor,
    this.padding,
    this.margin,
  });

  final String? message;
  final InlineSpan? richMessage;
  final Widget child;
  final TooltipPosition position;
  final Duration showDuration;
  final Duration waitDuration;
  final Color? backgroundColor;
  final Color? textColor;
  final EdgeInsets? padding;
  final EdgeInsets? margin;

  /// Create a rich tooltip with formatted text
  const AppTooltip.rich({
    super.key,
    required this.richMessage,
    required this.child,
    this.position = TooltipPosition.top,
    this.showDuration = const Duration(seconds: 2),
    this.waitDuration = const Duration(milliseconds: 500),
    this.backgroundColor,
    this.textColor,
    this.padding,
    this.margin,
  }) : message = null;

  @override
  Widget build(BuildContext context) {
    final tooltipPadding = padding ?? spacing(context).allSm;
    final tooltipMargin = margin ?? spacing(context).allXs;
    final bgColor = backgroundColor ?? colors(context).baseContent;
    final fgColor = textColor ?? Colors.white;

    return Tooltip(
      message: message ?? '',
      richMessage: richMessage,
      preferBelow: position == TooltipPosition.bottom,
      verticalOffset: _getVerticalOffset(position),
      showDuration: showDuration,
      waitDuration: waitDuration,
      padding: tooltipPadding,
      margin: tooltipMargin,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: radius(context).borderMd,
        boxShadow: shadows(context).md,
      ),
      textStyle: TextStyle(
        fontSize: typography(context).sm,
        color: fgColor,
      ),
      child: child,
    );
  }

  double _getVerticalOffset(TooltipPosition position) {
    return switch (position) {
      TooltipPosition.top => -8.0,
      TooltipPosition.bottom => 8.0,
      TooltipPosition.left => 0.0,
      TooltipPosition.right => 0.0,
    };
  }
}

/// A tooltip trigger icon button
class AppTooltipIcon extends AppWidget {
  const AppTooltipIcon({
    super.key,
    required this.message,
    this.icon = Icons.info_outline,
    this.iconSize,
    this.iconColor,
    this.position = TooltipPosition.top,
  });

  final String message;
  final IconData icon;
  final double? iconSize;
  final Color? iconColor;
  final TooltipPosition position;

  @override
  Widget build(BuildContext context) {
    return AppTooltip(
      message: message,
      position: position,
      child: Icon(
        icon,
        size: iconSize ?? sizing(context).iconSm,
        color: iconColor ?? colors(context).baseSubContent,
      ),
    );
  }
}
