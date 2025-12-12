import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';

/// A customizable divider component
class AppDivider extends AppWidget {
  const AppDivider({
    super.key,
    this.direction = LayoutDirection.horizontal,
    this.thickness,
    this.color,
    this.indent,
    this.endIndent,
    this.label,
  });

  final LayoutDirection direction;
  final double? thickness;
  final Color? color;
  final double? indent;
  final double? endIndent;
  final String? label;

  /// Create a horizontal divider
  const AppDivider.horizontal({
    super.key,
    this.thickness,
    this.color,
    this.indent,
    this.endIndent,
    this.label,
  }) : direction = LayoutDirection.horizontal;

  /// Create a vertical divider
  const AppDivider.vertical({
    super.key,
    this.thickness,
    this.color,
    this.indent,
    this.endIndent,
  })  : direction = LayoutDirection.vertical,
        label = null;

  @override
  Widget build(BuildContext context) {
    final dividerColor = color ?? colors(context).base300;
    final dividerThickness = thickness ?? 1.0;

    if (label != null && direction.isHorizontal) {
      return Row(
        children: [
          if (indent == null || indent! > 0)
            Expanded(
              child: Divider(
                thickness: dividerThickness,
                color: dividerColor,
                indent: indent,
                endIndent: spacing(context).sm,
              ),
            )
          else
            SizedBox(width: indent ?? 0),
          Text(
            label!,
            style: TextStyle(
              fontSize: typography(context).sm,
              color: colors(context).baseSubContent,
            ),
          ),
          if (endIndent == null || endIndent! > 0)
            Expanded(
              child: Divider(
                thickness: dividerThickness,
                color: dividerColor,
                indent: spacing(context).sm,
                endIndent: endIndent,
              ),
            )
          else
            SizedBox(width: endIndent ?? 0),
        ],
      );
    }

    if (direction.isVertical) {
      return VerticalDivider(
        thickness: dividerThickness,
        color: dividerColor,
        indent: indent,
        endIndent: endIndent,
        width: dividerThickness,
      );
    }

    return Divider(
      thickness: dividerThickness,
      color: dividerColor,
      indent: indent,
      endIndent: endIndent,
      height: dividerThickness,
    );
  }
}
