import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'bottom_nav_item.dart';

/// A customizable bottom navigation bar
class AppBottomNav extends AppWidget {
  const AppBottomNav({
    super.key,
    required this.items,
    required this.currentIndex,
    required this.onTap,
    this.backgroundColor,
    this.selectedColor,
    this.unselectedColor,
    this.showLabels = true,
    this.elevation,
  });

  final List<AppBottomNavItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;
  final Color? backgroundColor;
  final Color? selectedColor;
  final Color? unselectedColor;
  final bool showLabels;
  final double? elevation;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: backgroundColor ?? colors(context).base100,
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(
            items.length,
            (index) => _BottomNavItem(
              item: items[index],
              isSelected: currentIndex == index,
              onTap: () => onTap(index),
              selectedColor: selectedColor ?? colors(context).primary,
              unselectedColor:
                  unselectedColor ?? colors(context).baseSubContent,
              showLabel: showLabels,
            ),
          ),
        ),
      ),
    );
  }
}

class _BottomNavItem extends AppWidget {
  const _BottomNavItem({
    required this.item,
    required this.isSelected,
    required this.onTap,
    required this.selectedColor,
    required this.unselectedColor,
    required this.showLabel,
  });

  final AppBottomNavItem item;
  final bool isSelected;
  final VoidCallback onTap;
  final Color selectedColor;
  final Color unselectedColor;
  final bool showLabel;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? selectedColor : unselectedColor;
    final icon =
        isSelected && item.activeIcon != null ? item.activeIcon! : item.icon;

    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: spacing(context).verticalSm,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            spacing: spacing(context).xxs,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(
                    icon,
                    size: sizing(context).iconMd,
                    color: color,
                  ),
                  if (item.badge != null)
                    Positioned(
                      right: -8,
                      top: -4,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: spacing(context).xxs,
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
                          item.badge!,
                          style: TextStyle(
                            fontSize: typography(context).xs,
                            color: Colors.white,
                            fontWeight: typography(context).bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              if (showLabel)
                Text(
                  item.label,
                  style: TextStyle(
                    fontSize: typography(context).xs,
                    color: color,
                    fontWeight: isSelected
                        ? typography(context).semiBold
                        : typography(context).regular,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
