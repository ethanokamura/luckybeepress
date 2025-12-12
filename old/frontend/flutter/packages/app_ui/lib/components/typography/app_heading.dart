import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';

/// Heading level enum
enum HeadingLevel {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6;

  int get level => index + 1;
}

/// A heading text widget with semantic levels
class AppHeading extends AppWidget {
  const AppHeading(
    this.text, {
    super.key,
    this.level = HeadingLevel.h1,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  });

  /// Create an H1 heading
  const AppHeading.h1(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h1;

  /// Create an H2 heading
  const AppHeading.h2(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h2;

  /// Create an H3 heading
  const AppHeading.h3(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h3;

  /// Create an H4 heading
  const AppHeading.h4(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h4;

  /// Create an H5 heading
  const AppHeading.h5(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h5;

  /// Create an H6 heading
  const AppHeading.h6(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.letterSpacing,
    this.style,
  }) : level = HeadingLevel.h6;

  final String text;
  final HeadingLevel level;
  final Color? color;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final double? letterSpacing;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: TextStyle(
        fontSize: _getFontSize(context),
        fontWeight: _getFontWeight(context),
        color: color ?? colors(context).baseContent,
        letterSpacing: letterSpacing ?? _getLetterSpacing(context),
        height: typography(context).lineHeightTight,
        fontFamily: typography(context).displayFont,
      ).merge(style),
    );
  }

  double _getFontSize(BuildContext context) {
    final typo = typography(context);
    return switch (level) {
      HeadingLevel.h1 => typo.xxxl,
      HeadingLevel.h2 => typo.xxl,
      HeadingLevel.h3 => typo.xl,
      HeadingLevel.h4 => typo.lg,
      HeadingLevel.h5 => typo.base,
      HeadingLevel.h6 => typo.sm,
    };
  }

  FontWeight _getFontWeight(BuildContext context) {
    final typo = typography(context);
    return switch (level) {
      HeadingLevel.h1 => typo.extraBold,
      HeadingLevel.h2 => typo.bold,
      HeadingLevel.h3 => typo.bold,
      HeadingLevel.h4 => typo.semiBold,
      HeadingLevel.h5 => typo.semiBold,
      HeadingLevel.h6 => typo.medium,
    };
  }

  double _getLetterSpacing(BuildContext context) {
    final typo = typography(context);
    // Larger headings benefit from tighter letter spacing
    return switch (level) {
      HeadingLevel.h1 => typo.letterSpacingTight,
      HeadingLevel.h2 => typo.letterSpacingTight,
      _ => typo.letterSpacingNormal,
    };
  }
}

/// Display text for hero sections (even larger than H1)
class AppDisplay extends AppWidget {
  const AppDisplay(
    this.text, {
    super.key,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.style,
  });

  final String text;
  final Color? color;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: TextStyle(
        fontSize: typography(context).display,
        fontWeight: typography(context).extraBold,
        color: color ?? colors(context).baseContent,
        letterSpacing: typography(context).letterSpacingTight,
        height: typography(context).lineHeightTight,
        fontFamily: typography(context).displayFont,
      ).merge(style),
    );
  }
}
