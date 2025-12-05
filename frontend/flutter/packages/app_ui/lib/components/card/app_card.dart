import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';
import 'card_enums.dart';

/// A versatile card component for grouping content
class AppCard extends AppWidget {
  const AppCard({
    super.key,
    required this.child,
    this.variant = CardVariant.elevated,
    this.elevation = CardElevation.medium,
    this.onTap,
    this.padding,
    this.borderRadius,
    this.color,
    this.borderColor,
    this.header,
    this.footer,
    this.width,
    this.height,
    this.clipBehavior = Clip.antiAlias,
  });

  final Widget child;
  final CardVariant variant;
  final CardElevation elevation;
  final VoidCallback? onTap;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final Color? color;
  final Color? borderColor;
  final Widget? header;
  final Widget? footer;
  final double? width;
  final double? height;
  final Clip clipBehavior;

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? _getCardColor(context);
    final cardBorderRadius = borderRadius ?? radius(context).borderMd;
    final cardPadding = padding ?? spacing(context).allMd;
    final cardShadow = _getCardShadow(context);
    final cardBorder = _getCardBorder(context);

    Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (header != null) ...[
          header!,
          Divider(
            height: 1,
            color: colors(context).base300,
          ),
        ],
        Padding(
          padding: cardPadding,
          child: child,
        ),
        if (footer != null) ...[
          Divider(
            height: 1,
            color: colors(context).base300,
          ),
          footer!,
        ],
      ],
    );

    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: cardBorderRadius,
        boxShadow: cardShadow,
        border: cardBorder,
      ),
      clipBehavior: clipBehavior,
      child: onTap != null
          ? Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onTap,
                borderRadius: cardBorderRadius,
                child: content,
              ),
            )
          : content,
    );
  }

  Color _getCardColor(BuildContext context) {
    return switch (variant) {
      CardVariant.elevated => colors(context).base100,
      CardVariant.outlined => colors(context).base100,
      CardVariant.filled => colors(context).base300,
    };
  }

  List<BoxShadow>? _getCardShadow(BuildContext context) {
    if (variant != CardVariant.elevated) return null;

    return switch (elevation) {
      CardElevation.none => null,
      CardElevation.small => shadows(context).sm,
      CardElevation.medium => shadows(context).md,
      CardElevation.large => shadows(context).lg,
    };
  }

  Border? _getCardBorder(BuildContext context) {
    if (variant != CardVariant.outlined) return null;

    return Border.all(
      color: borderColor ?? colors(context).base300,
      width: 1,
    );
  }
}

/// A card with a header section
class AppCardHeader extends AppWidget {
  const AppCardHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.trailing,
    this.leading,
    this.padding,
  });

  final Widget title;
  final Widget? subtitle;
  final Widget? trailing;
  final Widget? leading;
  final EdgeInsets? padding;

  @override
  Widget build(BuildContext context) {
    final cardPadding = padding ?? spacing(context).allMd;

    return Padding(
      padding: cardPadding,
      child: Row(
        children: [
          if (leading != null) ...[
            leading!,
            SizedBox(width: spacing(context).sm),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                DefaultTextStyle(
                  style: TextStyle(
                    fontSize: typography(context).lg,
                    fontWeight: typography(context).semiBold,
                    color: colors(context).baseContent,
                  ),
                  child: title,
                ),
                if (subtitle != null) ...[
                  SizedBox(height: spacing(context).xxs),
                  DefaultTextStyle(
                    style: TextStyle(
                      fontSize: typography(context).sm,
                      color: colors(context).baseSubContent,
                    ),
                    child: subtitle!,
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) ...[
            SizedBox(width: spacing(context).sm),
            trailing!,
          ],
        ],
      ),
    );
  }
}

/// A card footer section
class AppCardFooter extends AppWidget {
  const AppCardFooter({
    super.key,
    required this.children,
    this.padding,
    this.alignment = MainAxisAlignment.end,
  });

  final List<Widget> children;
  final EdgeInsets? padding;
  final MainAxisAlignment alignment;

  @override
  Widget build(BuildContext context) {
    final cardPadding = padding ?? spacing(context).allMd;

    return Padding(
      padding: cardPadding,
      child: Row(
        mainAxisAlignment: alignment,
        children: children,
      ),
    );
  }
}
