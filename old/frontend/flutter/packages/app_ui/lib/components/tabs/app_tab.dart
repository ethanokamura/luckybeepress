import 'package:flutter/material.dart';

/// A single tab item
class AppTabItem {
  const AppTabItem({
    required this.label,
    this.icon,
    this.badge,
  });

  final String label;
  final IconData? icon;
  final String? badge;
}
