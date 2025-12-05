import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'checkbox_enums.dart';

/// A customizable checkbox component
class AppCheckbox extends AppWidget {
  const AppCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.size = CheckboxSize.medium,
    this.tristate = false,
    this.activeColor,
    this.checkColor,
    this.error = false,
    this.errorText,
    this.disabled = false,
  });

  final bool? value;
  final ValueChanged<bool?>? onChanged;
  final String? label;
  final CheckboxSize size;
  final bool tristate;
  final Color? activeColor;
  final Color? checkColor;
  final bool error;
  final String? errorText;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final isDisabled = disabled || onChanged == null;

    Widget checkbox = SizedBox(
      width: _getSize(),
      height: _getSize(),
      child: Checkbox(
        value: value,
        onChanged: isDisabled ? null : onChanged,
        tristate: tristate,
        activeColor: error
            ? colors(context).error
            : (activeColor ?? colors(context).primary),
        checkColor: checkColor ?? Colors.white,
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        visualDensity: VisualDensity.compact,
      ),
    );

    if (label == null && errorText == null) {
      return checkbox;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: isDisabled ? null : () => onChanged?.call(!(value ?? false)),
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
                checkbox,
                if (label != null)
                  Flexible(
                    child: Text(
                      label!,
                      style: TextStyle(
                        fontSize: _getLabelSize(context),
                        color: isDisabled
                            ? colors(context).baseSubContent.withAlpha(100)
                            : error
                                ? colors(context).error
                                : colors(context).baseContent,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        if (error && errorText != null) ...[
          SizedBox(height: spacing(context).xs),
          Padding(
            padding: EdgeInsets.only(left: _getSize() + spacing(context).sm),
            child: Text(
              errorText!,
              style: TextStyle(
                fontSize: typography(context).xs,
                color: colors(context).error,
              ),
            ),
          ),
        ],
      ],
    );
  }

  double _getSize() {
    return switch (size) {
      CheckboxSize.small => 16.0,
      CheckboxSize.medium => 20.0,
      CheckboxSize.large => 24.0,
    };
  }

  double _getLabelSize(BuildContext context) {
    return switch (size) {
      CheckboxSize.small => typography(context).sm,
      CheckboxSize.medium => typography(context).base,
      CheckboxSize.large => typography(context).lg,
    };
  }
}

/// A checkbox list tile with more layout options
class AppCheckboxListTile extends AppWidget {
  const AppCheckboxListTile({
    super.key,
    required this.value,
    required this.onChanged,
    required this.title,
    this.subtitle,
    this.size = CheckboxSize.medium,
    this.activeColor,
    this.secondary,
    this.controlAffinity = ListTileControlAffinity.leading,
    this.disabled = false,
  });

  final bool value;
  final ValueChanged<bool?>? onChanged;
  final Widget title;
  final Widget? subtitle;
  final CheckboxSize size;
  final Color? activeColor;
  final Widget? secondary;
  final ListTileControlAffinity controlAffinity;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    return CheckboxListTile(
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
      activeColor: activeColor ?? colors(context).primary,
      checkColor: Colors.white,
      secondary: secondary,
      controlAffinity: controlAffinity,
      contentPadding: spacing(context).horizontalMd,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }

  double _getTitleSize(BuildContext context) {
    return switch (size) {
      CheckboxSize.small => typography(context).sm,
      CheckboxSize.medium => typography(context).base,
      CheckboxSize.large => typography(context).lg,
    };
  }
}
