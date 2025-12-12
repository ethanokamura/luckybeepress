import 'package:flutter/material.dart';

class AppColors {
  const AppColors({
    // Base colors
    this.base100 = const Color(0xFFF8F8F7),
    this.base200 = const Color(0xFFF0F0EE),
    this.base300 = const Color(0xFFE0E0DD),
    this.baseContent = const Color(0xFF5E5E5A),
    this.baseSubContent = const Color(0xFF5E5E5A),

    // Primary
    this.primary = const Color(0xFF0F0A15),
    this.primaryContent = const Color(0xFFD4FFBA),

    // Secondary
    this.secondary = const Color(0xFF0F0A15),
    this.secondaryContent = const Color(0xFFFFC38A),

    // Accent
    this.accent = const Color(0xFF0F0A15),
    this.accentContent = const Color(0xFF9CFFE5),

    // Neutral
    this.neutral = const Color(0xFF090909),
    this.neutralContent = const Color(0xFFCCCCC8),

    // Semantic colors
    this.info = const Color(0xFFA0C4FF),
    this.infoContent = const Color(0xFF003566),
    this.success = const Color(0xFFB8F3C6),
    this.successContent = const Color(0xFF0A3D16),
    this.warning = const Color(0xFFFFE4A3),
    this.warningContent = const Color(0xFF6B4700),
    this.error = const Color(0xFFFFB4A3),
    this.errorContent = const Color(0xFF6B1A00),
  });

  // Base colors
  final Color base100;
  final Color base200;
  final Color base300;
  final Color baseContent;
  final Color baseSubContent;

  // Primary Palette
  final Color primary;
  final Color primaryContent;

  // Secondary Palette
  final Color secondary;
  final Color secondaryContent;

  // Accent Palette
  final Color accent;
  final Color accentContent;

  // Neutral Palette
  final Color neutral;
  final Color neutralContent;

  // Semantic Colors
  final Color info;
  final Color infoContent;
  final Color success;
  final Color successContent;
  final Color warning;
  final Color warningContent;
  final Color error;
  final Color errorContent;

  // Helper method to convert to Material ColorScheme
  ColorScheme toColorScheme({Brightness brightness = Brightness.light}) {
    return ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: primaryContent,
      secondary: secondary,
      onSecondary: secondaryContent,
      error: error,
      onError: errorContent,
      surface: base100,
      onSurface: baseContent,
      surfaceContainerHighest: base200,
    );
  }

  // Create a dark theme variant
  AppColors copyWith({
    Color? base100,
    Color? base200,
    Color? base300,
    Color? baseContent,
    Color? baseSubContent,
    Color? primary,
    Color? primaryContent,
    Color? secondary,
    Color? secondaryContent,
    Color? accent,
    Color? accentContent,
    Color? neutral,
    Color? neutralContent,
    Color? info,
    Color? infoContent,
    Color? success,
    Color? successContent,
    Color? warning,
    Color? warningContent,
    Color? error,
    Color? errorContent,
  }) {
    return AppColors(
      base100: base100 ?? this.base100,
      base200: base200 ?? this.base200,
      base300: base300 ?? this.base300,
      baseContent: baseContent ?? this.baseContent,
      baseSubContent: baseSubContent ?? this.baseSubContent,
      primary: primary ?? this.primary,
      primaryContent: primaryContent ?? this.primaryContent,
      secondary: secondary ?? this.secondary,
      secondaryContent: secondaryContent ?? this.secondaryContent,
      accent: accent ?? this.accent,
      accentContent: accentContent ?? this.accentContent,
      neutral: neutral ?? this.neutral,
      neutralContent: neutralContent ?? this.neutralContent,
      info: info ?? this.info,
      infoContent: infoContent ?? this.infoContent,
      success: success ?? this.success,
      successContent: successContent ?? this.successContent,
      warning: warning ?? this.warning,
      warningContent: warningContent ?? this.warningContent,
      error: error ?? this.error,
      errorContent: errorContent ?? this.errorContent,
    );
  }

  // Predefined dark theme
  static AppColors dark() {
    return const AppColors(
      base100: Color(0xFF1A1A2E),
      base200: Color(0xFF16162A),
      base300: Color(0xFF131326),
      baseContent: Color(0xFFB8BCD4),
      baseSubContent: Color(0xFFB8BCD4),
      primary: Color(0xFFFFAB73),
      primaryContent: Color(0xFF1F0900),
      secondary: Color(0xFFFF9EA0),
      secondaryContent: Color(0xFF1F0001),
      accent: Color(0xFFD99FFF),
      accentContent: Color(0xFF1F001F),
      neutral: Color(0xFF25253A),
      neutralContent: Color(0xFFA5A5BA),
      info: Color(0xFFC4E4FF),
      infoContent: Color(0xFF001F2F),
      success: Color(0xFFC4FFD4),
      successContent: Color(0xFF001F0F),
      warning: Color(0xFFFFE4C4),
      warningContent: Color(0xFF2F1F00),
      error: Color(0xFFFFC4C4),
      errorContent: Color(0xFF2F0000),
    );
  }
}
