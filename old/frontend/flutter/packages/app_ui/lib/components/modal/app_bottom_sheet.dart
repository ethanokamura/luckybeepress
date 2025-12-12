import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// A bottom sheet component
class AppBottomSheet extends AppWidget {
  const AppBottomSheet({
    super.key,
    required this.child,
    this.title,
    this.showDragHandle = true,
    this.padding,
    this.backgroundColor,
  });

  final Widget child;
  final String? title;
  final bool showDragHandle;
  final EdgeInsets? padding;
  final Color? backgroundColor;

  /// Show this bottom sheet
  static Future<T?> show<T>({
    required BuildContext context,
    required Widget child,
    String? title,
    bool showDragHandle = true,
    EdgeInsets? padding,
    Color? backgroundColor,
    bool isDismissible = true,
    bool enableDrag = true,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
      backgroundColor: Colors.transparent,
      builder: (context) => AppBottomSheet(
        title: title,
        showDragHandle: showDragHandle,
        padding: padding,
        backgroundColor: backgroundColor,
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final sheetPadding = padding ?? spacing(context).allLg;
    final bgColor = backgroundColor ?? colors(context).base100;

    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(radius(context).lg),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDragHandle) ...[
            SizedBox(height: spacing(context).sm),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: colors(context).base300,
                borderRadius: radius(context).borderFull,
              ),
            ),
            SizedBox(height: spacing(context).sm),
          ],
          if (title != null) ...[
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: spacing(context).lg,
                vertical: spacing(context).md,
              ),
              child: Text(
                title!,
                style: TextStyle(
                  fontSize: typography(context).lg,
                  fontWeight: typography(context).semiBold,
                  color: colors(context).baseContent,
                ),
              ),
            ),
            Divider(
              height: 1,
              color: colors(context).base300,
            ),
          ],
          Flexible(
            child: SingleChildScrollView(
              padding: sheetPadding,
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
