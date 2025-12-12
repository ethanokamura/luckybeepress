import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'app_tab.dart';
import 'tabs_enums.dart';

/// A customizable tabs component
class AppTabs extends AppWidget {
  const AppTabs({
    super.key,
    required this.tabs,
    required this.children,
    this.controller,
    this.initialIndex = 0,
    this.onTap,
    this.isScrollable = false,
    this.indicatorStyle = TabIndicatorStyle.underline,
    this.indicatorColor,
    this.labelColor,
    this.unselectedLabelColor,
  });

  final List<AppTabItem> tabs;
  final List<Widget> children;
  final TabController? controller;
  final int initialIndex;
  final ValueChanged<int>? onTap;
  final bool isScrollable;
  final TabIndicatorStyle indicatorStyle;
  final Color? indicatorColor;
  final Color? labelColor;
  final Color? unselectedLabelColor;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: tabs.length,
      initialIndex: initialIndex,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: colors(context).base300,
                  width: 1,
                ),
              ),
            ),
            child: TabBar(
              controller: controller,
              onTap: onTap,
              isScrollable: isScrollable,
              tabs: tabs.map((tab) => _buildTab(context, tab)).toList(),
              labelColor: labelColor ?? colors(context).primary,
              unselectedLabelColor:
                  unselectedLabelColor ?? colors(context).baseSubContent,
              labelStyle: TextStyle(
                fontSize: typography(context).base,
                fontWeight: typography(context).semiBold,
              ),
              unselectedLabelStyle: TextStyle(
                fontSize: typography(context).base,
                fontWeight: typography(context).regular,
              ),
              indicator: _buildIndicator(context),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              padding: EdgeInsets.zero,
              indicatorPadding: EdgeInsets.zero,
              labelPadding: spacing(context).horizontalMd,
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: controller,
              children: children,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(BuildContext context, AppTabItem tab) {
    return Tab(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: spacing(context).xs,
        children: [
          if (tab.icon != null)
            Icon(
              tab.icon,
              size: sizing(context).iconSm,
            ),
          Text(tab.label),
          if (tab.badge != null)
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: spacing(context).xs,
                vertical: 2,
              ),
              decoration: BoxDecoration(
                color: colors(context).error,
                borderRadius: radius(context).borderFull,
              ),
              constraints: const BoxConstraints(
                minWidth: 16,
                minHeight: 16,
              ),
              child: Text(
                tab.badge!,
                style: TextStyle(
                  fontSize: typography(context).xs,
                  color: Colors.white,
                  fontWeight: typography(context).bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
        ],
      ),
    );
  }

  Decoration? _buildIndicator(BuildContext context) {
    if (indicatorStyle.isNone) return null;

    final color = indicatorColor ?? colors(context).primary;

    if (indicatorStyle.isBox) {
      return BoxDecoration(
        color: color.withAlpha(26), // 10% opacity
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(radius(context).sm),
        ),
      );
    }

    return UnderlineTabIndicator(
      borderSide: BorderSide(
        color: color,
        width: 2,
      ),
      insets: EdgeInsets.zero,
    );
  }
}
