import 'package:app_ui/components/navbar/app_navbar.dart';
import 'package:app_ui/components/typography/app_heading.dart';
import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

class AppPage extends AppWidget {
  const AppPage({
    required this.body,
    this.centerTitle = false,
    this.drawer,
    this.endDrawer,
    this.floatingActionButton,
    this.bottomNavigationBar,
    this.leading,
    this.maxWidth,
    this.title = '',
    this.titleWidget,
    this.actions = const [],
    this.gradient,
    super.key,
  });

  final Widget body;
  final String title;
  final Widget? titleWidget;
  final bool centerTitle;
  final List<Widget> actions;
  final Widget? leading;
  final Widget? drawer;
  final Widget? endDrawer;
  final Widget? floatingActionButton;
  final Widget? bottomNavigationBar;
  final double? maxWidth;
  final Gradient? gradient;

  @override
  Widget build(BuildContext context) {
    final appBar = title.isNotEmpty || actions.isNotEmpty;
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: colors(context).base200,
        appBar: appBar
            ? AppNavbar(
                leading: leading,
                centerTitle: centerTitle,
                title: title.isNotEmpty ? AppHeading.h1(title) : titleWidget,
                actions: actions,
              )
            : null,
        drawer: drawer,
        endDrawer: endDrawer,
        floatingActionButton: floatingActionButton,
        body: body,
        bottomNavigationBar: bottomNavigationBar,
      ),
    );
  }
}
