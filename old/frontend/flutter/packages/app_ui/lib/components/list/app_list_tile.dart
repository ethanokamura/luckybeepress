import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// A pre-built list tile with common patterns
class AppListTile extends AppWidget {
  const AppListTile({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.selected = false,
    this.enabled = true,
  });

  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  final bool enabled;

  /// Create a list tile with an icon
  AppListTile.icon({
    super.key,
    required this.title,
    this.subtitle,
    required IconData icon,
    this.trailing,
    this.onTap,
    this.selected = false,
    this.enabled = true,
  }) : leading = _IconLeading(icon: icon);

  /// Create a list tile with an avatar
  const AppListTile.avatar({
    super.key,
    required this.title,
    this.subtitle,
    required Widget avatar,
    this.trailing,
    this.onTap,
    this.selected = false,
    this.enabled = true,
  }) : leading = avatar;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(title),
      subtitle: subtitle != null ? Text(subtitle!) : null,
      leading: leading,
      trailing: trailing,
      onTap: enabled ? onTap : null,
      selected: selected,
      enabled: enabled,
      selectedTileColor: colors(context).primary.withAlpha(26),
      contentPadding: spacing(context).horizontalMd,
      textColor: colors(context).baseContent,
      iconColor: colors(context).baseSubContent,
    );
  }
}

class _IconLeading extends StatelessWidget {
  const _IconLeading({required this.icon});

  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Icon(icon);
  }
}
