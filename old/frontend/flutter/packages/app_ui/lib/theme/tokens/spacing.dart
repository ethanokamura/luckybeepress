import 'package:flutter/material.dart';

class AppSpacing {
  const AppSpacing({
    this.xxs = 4.0,
    this.xs = 8.0,
    this.sm = 12.0,
    this.md = 16.0,
    this.lg = 24.0,
    this.xl = 32.0,
    this.xxl = 48.0,
    this.xxxl = 64.0,
  });

  // Base-8 Spacing System
  final double xxs;
  final double xs;
  final double sm;
  final double md;
  final double lg;
  final double xl;
  final double xxl;
  final double xxxl;

  // Common padding presets
  EdgeInsets get allXxs => EdgeInsets.all(xxs);
  EdgeInsets get allXs => EdgeInsets.all(xs);
  EdgeInsets get allSm => EdgeInsets.all(sm);
  EdgeInsets get allMd => EdgeInsets.all(md);
  EdgeInsets get allLg => EdgeInsets.all(lg);
  EdgeInsets get allXl => EdgeInsets.all(xl);
  EdgeInsets get allXxl => EdgeInsets.all(xxl);

  // Horizontal padding
  EdgeInsets get horizontalXs => EdgeInsets.symmetric(horizontal: xs);
  EdgeInsets get horizontalSm => EdgeInsets.symmetric(horizontal: sm);
  EdgeInsets get horizontalMd => EdgeInsets.symmetric(horizontal: md);
  EdgeInsets get horizontalLg => EdgeInsets.symmetric(horizontal: lg);
  EdgeInsets get horizontalXl => EdgeInsets.symmetric(horizontal: xl);

  // Vertical padding
  EdgeInsets get verticalXs => EdgeInsets.symmetric(vertical: xs);
  EdgeInsets get verticalSm => EdgeInsets.symmetric(vertical: sm);
  EdgeInsets get verticalMd => EdgeInsets.symmetric(vertical: md);
  EdgeInsets get verticalLg => EdgeInsets.symmetric(vertical: lg);
  EdgeInsets get verticalXl => EdgeInsets.symmetric(vertical: xl);
}
