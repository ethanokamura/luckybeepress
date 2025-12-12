import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';

/// Text size variants
enum TextSize {
  xs,
  sm,
  base,
  lg,
  xl,
  xxl;
}

/// Text weight variants
enum TextWeight {
  light,
  regular,
  medium,
  semiBold,
  bold,
  extraBold;
}

/// A text widget with built-in theme styling
class AppText extends AppWidget {
  const AppText(
    this.text, {
    super.key,
    this.size,
    this.weight,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  });

  final String text;
  final TextSize? size;
  final TextWeight? weight;
  final Color? color;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final bool softWrap;
  final double? letterSpacing;
  final double? height;
  final TextDecoration? decoration;
  final TextStyle? style;

  /// Create a small text
  const AppText.sm(
    this.text, {
    super.key,
    this.weight,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  }) : size = TextSize.sm;

  /// Create a large text
  const AppText.lg(
    this.text, {
    super.key,
    this.weight,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  }) : size = TextSize.lg;

  /// Create an extra-large text
  const AppText.xl(
    this.text, {
    super.key,
    this.weight,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  }) : size = TextSize.xl;

  /// Create bold text
  const AppText.bold(
    this.text, {
    super.key,
    this.size,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  }) : weight = TextWeight.bold;

  /// Create secondary (muted) text
  const AppText.secondary(
    this.text, {
    super.key,
    this.size,
    this.weight,
    this.color,
    this.textAlign,
    this.maxLines = 1,
    this.overflow = TextOverflow.ellipsis,
    this.softWrap = true,
    this.letterSpacing,
    this.height,
    this.decoration,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = color ?? (style?.color) ?? colors(context).baseContent;

    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines ?? 1,
      overflow: overflow ?? TextOverflow.ellipsis,
      softWrap: softWrap,
      style: TextStyle(
        fontSize: _getFontSize(context),
        fontWeight: _getFontWeight(context),
        color: textColor,
        letterSpacing: letterSpacing,
        height: height,
        decoration: decoration,
        fontFamily: typography(context).bodyFont,
      ).merge(style),
    );
  }

  double _getFontSize(BuildContext context) {
    final typo = typography(context);
    return switch (size ?? TextSize.base) {
      TextSize.xs => typo.xs,
      TextSize.sm => typo.sm,
      TextSize.base => typo.base,
      TextSize.lg => typo.lg,
      TextSize.xl => typo.xl,
      TextSize.xxl => typo.xxl,
    };
  }

  FontWeight _getFontWeight(BuildContext context) {
    final typo = typography(context);
    return switch (weight ?? TextWeight.regular) {
      TextWeight.light => typo.light,
      TextWeight.regular => typo.regular,
      TextWeight.medium => typo.medium,
      TextWeight.semiBold => typo.semiBold,
      TextWeight.bold => typo.bold,
      TextWeight.extraBold => typo.extraBold,
    };
  }
}

/// A text widget for labels (uppercase, medium weight, letter spacing)
class AppLabel extends AppWidget {
  const AppLabel(
    this.text, {
    super.key,
    this.color,
    this.size = TextSize.sm,
  });

  final String text;
  final Color? color;
  final TextSize size;

  @override
  Widget build(BuildContext context) {
    return AppText(
      text.toUpperCase(),
      size: size,
      weight: TextWeight.medium,
      color: color ?? colors(context).baseSubContent,
      letterSpacing: typography(context).letterSpacingWide,
    );
  }
}

/// A text widget for captions (small, secondary color)
class AppCaption extends AppWidget {
  const AppCaption(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines = 1,
  });

  final String text;
  final Color? color;
  final TextAlign? textAlign;
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    return AppText(
      text,
      size: TextSize.xs,
      color: color ?? colors(context).baseSubContent,
      textAlign: textAlign,
      maxLines: maxLines,
    );
  }
}
