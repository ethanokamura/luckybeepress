import 'package:flutter/material.dart';

/// A bottom navigation bar item
class AppBottomNavItem {
  const AppBottomNavItem({
    required this.icon,
    required this.label,
    this.activeIcon,
    this.badge,
  });

  final IconData icon;
  final String label;
  final IconData? activeIcon;
  final String? badge;
}
