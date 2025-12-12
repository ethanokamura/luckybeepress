import 'package:flutter/material.dart';

class AppTypography {
  const AppTypography({
    // Fonts
    this.displayFont = 'Inter',
    this.bodyFont = 'Inter',
    this.monoFont = 'JetBrains Mono',

    // Sizes (Major Third scale - 1.25x)
    this.xs = 12.0,
    this.sm = 14.0,
    this.base = 16.0,
    this.lg = 20.0,
    this.xl = 24.0,
    this.xxl = 28.0,
    this.xxxl = 32.0,
    this.display = 49.0,

    // Weights
    this.light = FontWeight.w300,
    this.regular = FontWeight.w400,
    this.medium = FontWeight.w500,
    this.semiBold = FontWeight.w600,
    this.bold = FontWeight.w700,
    this.extraBold = FontWeight.w800,

    // Line Heights
    this.lineHeightTight = 1.25,
    this.lineHeightNormal = 1.5,
    this.lineHeightRelaxed = 1.75,
    this.lineHeightLoose = 2.0,

    // Letter Spacing
    this.letterSpacingTight = -0.5,
    this.letterSpacingNormal = 0.0,
    this.letterSpacingWide = 0.5,
    this.letterSpacingExtraWide = 1.0,
  });

  // Font Families
  final String displayFont;
  final String bodyFont;
  final String monoFont;

  // Font Sizes
  final double xs;
  final double sm;
  final double base;
  final double lg;
  final double xl;
  final double xxl;
  final double xxxl;
  final double display;

  // Font Weights
  final FontWeight light;
  final FontWeight regular;
  final FontWeight medium;
  final FontWeight semiBold;
  final FontWeight bold;
  final FontWeight extraBold;

  // Line Heights
  final double lineHeightTight;
  final double lineHeightNormal;
  final double lineHeightRelaxed;
  final double lineHeightLoose;

  // Letter Spacing
  final double letterSpacingTight;
  final double letterSpacingNormal;
  final double letterSpacingWide;
  final double letterSpacingExtraWide;

  // Convert to Material TextTheme
  TextTheme toTextTheme() {
    return TextTheme(
      displayLarge: TextStyle(
        fontFamily: displayFont,
        fontSize: display,
        fontWeight: extraBold,
        height: lineHeightTight,
        letterSpacing: letterSpacingTight,
      ),
      displayMedium: TextStyle(
        fontFamily: displayFont,
        fontSize: xxxl,
        fontWeight: bold,
        height: lineHeightTight,
        letterSpacing: letterSpacingTight,
      ),
      displaySmall: TextStyle(
        fontFamily: displayFont,
        fontSize: xxl,
        fontWeight: bold,
        height: lineHeightTight,
      ),
      headlineLarge: TextStyle(
        fontFamily: displayFont,
        fontSize: xl,
        fontWeight: semiBold,
        height: lineHeightTight,
      ),
      headlineMedium: TextStyle(
        fontFamily: displayFont,
        fontSize: lg,
        fontWeight: semiBold,
        height: lineHeightNormal,
      ),
      headlineSmall: TextStyle(
        fontFamily: displayFont,
        fontSize: base,
        fontWeight: semiBold,
        height: lineHeightNormal,
      ),
      bodyLarge: TextStyle(
        fontFamily: bodyFont,
        fontSize: lg,
        fontWeight: regular,
        height: lineHeightNormal,
      ),
      bodyMedium: TextStyle(
        fontFamily: bodyFont,
        fontSize: base,
        fontWeight: regular,
        height: lineHeightNormal,
      ),
      bodySmall: TextStyle(
        fontFamily: bodyFont,
        fontSize: sm,
        fontWeight: regular,
        height: lineHeightNormal,
      ),
      labelLarge: TextStyle(
        fontFamily: bodyFont,
        fontSize: base,
        fontWeight: medium,
        letterSpacing: letterSpacingWide,
      ),
      labelMedium: TextStyle(
        fontFamily: bodyFont,
        fontSize: sm,
        fontWeight: medium,
        letterSpacing: letterSpacingWide,
      ),
      labelSmall: TextStyle(
        fontFamily: bodyFont,
        fontSize: xs,
        fontWeight: medium,
        letterSpacing: letterSpacingWide,
      ),
    );
  }
}
