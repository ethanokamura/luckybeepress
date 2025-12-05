import 'package:flutter/material.dart';

class AppBorderRadius {
  const AppBorderRadius({
    this.none = 0.0,
    this.sm = 4.0,
    this.md = 8.0,
    this.lg = 12.0,
    this.xl = 16.0,
    this.xxl = 24.0,
    this.full = 9999.0,
  });

  final double none;
  final double sm;
  final double md;
  final double lg;
  final double xl;
  final double xxl;
  final double full;

  // Common BorderRadius presets
  BorderRadius get borderNone => BorderRadius.circular(none);
  BorderRadius get borderSm => BorderRadius.circular(sm);
  BorderRadius get borderMd => BorderRadius.circular(md);
  BorderRadius get borderLg => BorderRadius.circular(lg);
  BorderRadius get borderXl => BorderRadius.circular(xl);
  BorderRadius get borderXxl => BorderRadius.circular(xxl);
  BorderRadius get borderFull => BorderRadius.circular(full);

  // Top-only radius
  BorderRadius get topSm => BorderRadius.vertical(top: Radius.circular(sm));
  BorderRadius get topMd => BorderRadius.vertical(top: Radius.circular(md));
  BorderRadius get topLg => BorderRadius.vertical(top: Radius.circular(lg));

  // Bottom-only radius
  BorderRadius get bottomSm =>
      BorderRadius.vertical(bottom: Radius.circular(sm));
  BorderRadius get bottomMd =>
      BorderRadius.vertical(bottom: Radius.circular(md));
  BorderRadius get bottomLg =>
      BorderRadius.vertical(bottom: Radius.circular(lg));

  // Left-only radius
  BorderRadius get leftSm => BorderRadius.horizontal(left: Radius.circular(sm));
  BorderRadius get leftMd => BorderRadius.horizontal(left: Radius.circular(md));
  BorderRadius get leftLg => BorderRadius.horizontal(left: Radius.circular(lg));

  // Right-only radius
  BorderRadius get rightSm =>
      BorderRadius.horizontal(right: Radius.circular(sm));
  BorderRadius get rightMd =>
      BorderRadius.horizontal(right: Radius.circular(md));
  BorderRadius get rightLg =>
      BorderRadius.horizontal(right: Radius.circular(lg));
}
