import 'package:flutter/material.dart';

class AppShadows {
  const AppShadows({
    this.shadowColor = const Color(0xFF000000),
  });

  final Color shadowColor;

  // Material Design Elevation Levels
  List<BoxShadow> get sm => [
        BoxShadow(
          color: shadowColor.withAlpha(15),
          blurRadius: 3,
          offset: const Offset(0, 1),
        ),
      ];

  List<BoxShadow> get md => [
        BoxShadow(
          color: shadowColor.withAlpha(31),
          blurRadius: 6,
          offset: const Offset(0, 2),
        ),
      ];

  List<BoxShadow> get lg => [
        BoxShadow(
          color: shadowColor.withAlpha(41),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
      ];

  List<BoxShadow> get xl => [
        BoxShadow(
          color: shadowColor.withAlpha(51),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ];

  List<BoxShadow> get xxl => [
        BoxShadow(
          color: shadowColor.withAlpha(61),
          blurRadius: 40,
          offset: const Offset(0, 16),
        ),
      ];

  List<BoxShadow> get none => [];
}
