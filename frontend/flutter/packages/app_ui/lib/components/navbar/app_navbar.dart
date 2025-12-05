import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'navbar_enums.dart';

/// A customizable navigation bar (AppBar)
class AppNavbar extends AppWidget implements PreferredSizeWidget {
  const AppNavbar({
    super.key,
    this.title,
    this.leading,
    this.actions = const [],
    this.height = NavbarHeight.standard,
    this.backgroundColor,
    this.foregroundColor,
    this.surfaceTintColor,
    this.elevation,
    this.centerTitle = false,
    this.automaticallyImplyLeading = true,
  });

  final Widget? title;
  final Widget? leading;
  final List<Widget> actions;
  final NavbarHeight height;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? surfaceTintColor;
  final double? elevation;
  final bool centerTitle;
  final bool automaticallyImplyLeading;

  @override
  Size get preferredSize => Size.fromHeight(height.height);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: title,
      leading: leading,
      actions: actions,
      backgroundColor: backgroundColor ?? colors(context).base100,
      foregroundColor: foregroundColor ?? colors(context).baseContent,
      surfaceTintColor: surfaceTintColor ?? colors(context).base100,
      elevation: elevation ?? 0,
      centerTitle: centerTitle,
      automaticallyImplyLeading: automaticallyImplyLeading,
      toolbarHeight: height.height,
      shape: Border(
        bottom: BorderSide(
          color: colors(context).base300,
          width: 1,
        ),
      ),
    );
  }
}
