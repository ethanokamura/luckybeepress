import 'package:app_ui/core/base_widget.dart';
import 'package:app_ui/theme/theme.dart';
import 'package:flutter/material.dart';

class AppList extends AppWidget {
  const AppList({
    required this.child,
    this.padding = true,
    super.key,
  });
  final Widget child;
  final bool padding;

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      clipper: TopClipper(),
      child: SingleChildScrollView(
        padding: padding ? context.spacing.allMd : null,
        clipBehavior: Clip.none,
        child: child,
      ),
    );
  }
}
