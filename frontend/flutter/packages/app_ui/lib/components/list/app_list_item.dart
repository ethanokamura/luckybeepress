import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// A customizable list item component
class AppListItem extends AppWidget {
  const AppListItem({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.selected = false,
    this.enabled = true,
    this.dense = false,
    this.contentPadding,
  });

  final Widget title;
  final Widget? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final bool selected;
  final bool enabled;
  final bool dense;
  final EdgeInsets? contentPadding;

  @override
  Widget build(BuildContext context) {
    final padding = contentPadding ?? spacing(context).allMd;

    return Material(
      color:
          selected ? colors(context).primary.withAlpha(26) : Colors.transparent,
      child: InkWell(
        onTap: enabled ? onTap : null,
        onLongPress: enabled ? onLongPress : null,
        child: Padding(
          padding: padding,
          child: Row(
            spacing: spacing(context).md,
            children: [
              if (leading != null) leading!,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  spacing: dense ? spacing(context).xxs : spacing(context).xs,
                  children: [
                    DefaultTextStyle(
                      style: TextStyle(
                        fontSize: dense
                            ? typography(context).sm
                            : typography(context).base,
                        fontWeight: typography(context).medium,
                        color: enabled
                            ? colors(context).baseContent
                            : colors(context).baseSubContent.withAlpha(100),
                      ),
                      child: title,
                    ),
                    if (subtitle != null)
                      DefaultTextStyle(
                        style: TextStyle(
                          fontSize: typography(context).sm,
                          color: enabled
                              ? colors(context).baseSubContent
                              : colors(context).baseSubContent.withAlpha(100),
                        ),
                        child: subtitle!,
                      ),
                  ],
                ),
              ),
              if (trailing != null) trailing!,
            ],
          ),
        ),
      ),
    );
  }
}
