import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'toggle_enums.dart';

/// A customizable toggle/switch component
class AppToggle extends AppWidget {
  const AppToggle({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.size = ToggleSize.medium,
    this.activeColor,
    this.inactiveColor,
    this.disabled = false,
  });

  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final ToggleSize size;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final isDisabled = disabled || onChanged == null;

    Widget toggle = Transform.scale(
      scale: _getScale(),
      child: Switch(
        value: value,
        onChanged: isDisabled ? null : onChanged,
        activeThumbColor: activeColor ?? colors(context).primary,
        inactiveTrackColor: inactiveColor ?? colors(context).base300,
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
    );

    if (label == null) {
      return toggle;
    }

    return InkWell(
      onTap: isDisabled ? null : () => onChanged?.call(!value),
      borderRadius: radius(context).borderSm,
      child: Padding(
        padding: EdgeInsets.symmetric(
          vertical: spacing(context).xs,
          horizontal: spacing(context).xxs,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: spacing(context).sm,
          children: [
            Flexible(
              child: Text(
                label!,
                style: TextStyle(
                  fontSize: _getLabelSize(context),
                  color: isDisabled
                      ? colors(context).baseSubContent.withAlpha(100)
                      : colors(context).baseContent,
                ),
              ),
            ),
            toggle,
          ],
        ),
      ),
    );
  }

  double _getScale() {
    return switch (size) {
      ToggleSize.small => 0.8,
      ToggleSize.medium => 1.0,
      ToggleSize.large => 1.2,
    };
  }

  double _getLabelSize(BuildContext context) {
    return switch (size) {
      ToggleSize.small => typography(context).sm,
      ToggleSize.medium => typography(context).base,
      ToggleSize.large => typography(context).lg,
    };
  }
}

/// A toggle list tile with more layout options
class AppToggleListTile extends AppWidget {
  const AppToggleListTile({
    super.key,
    required this.value,
    required this.onChanged,
    required this.title,
    this.subtitle,
    this.size = ToggleSize.medium,
    this.activeColor,
    this.secondary,
    this.disabled = false,
  });

  final bool value;
  final ValueChanged<bool>? onChanged;
  final Widget title;
  final Widget? subtitle;
  final ToggleSize size;
  final Color? activeColor;
  final Widget? secondary;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      value: value,
      onChanged: disabled ? null : onChanged,
      title: DefaultTextStyle(
        style: TextStyle(
          fontSize: _getTitleSize(context),
          color: disabled
              ? colors(context).baseSubContent.withAlpha(100)
              : colors(context).baseContent,
        ),
        child: title,
      ),
      subtitle: subtitle != null
          ? DefaultTextStyle(
              style: TextStyle(
                fontSize: typography(context).sm,
                color: colors(context).baseSubContent,
              ),
              child: subtitle!,
            )
          : null,
      activeThumbColor: activeColor ?? colors(context).primary,
      secondary: secondary,
      contentPadding: spacing(context).horizontalMd,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  double _getTitleSize(BuildContext context) {
    return switch (size) {
      ToggleSize.small => typography(context).sm,
      ToggleSize.medium => typography(context).base,
      ToggleSize.large => typography(context).lg,
    };
  }
}
