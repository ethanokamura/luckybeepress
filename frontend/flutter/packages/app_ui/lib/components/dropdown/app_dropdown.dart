import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../input/input_enums.dart';
import 'dropdown_enums.dart';

/// A dropdown option
class DropdownOption<T> {
  const DropdownOption({
    required this.value,
    required this.label,
    this.icon,
  });

  final T value;
  final String label;
  final IconData? icon;
}

/// A customizable dropdown/select component
class AppDropdown<T> extends AppWidget {
  const AppDropdown({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder = 'Select an option',
    this.helperText,
    this.errorText,
    this.validationState = ValidationState.none,
    this.size = DropdownSize.medium,
    this.prefixIcon,
    this.disabled = false,
  });

  final List<DropdownOption<T>> options;
  final T? value;
  final ValueChanged<T?> onChanged;
  final String? label;
  final String placeholder;
  final String? helperText;
  final String? errorText;
  final ValidationState validationState;
  final DropdownSize size;
  final IconData? prefixIcon;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: TextStyle(
              fontSize: typography(context).sm,
              fontWeight: typography(context).medium,
              color: disabled
                  ? colors(context).baseSubContent.withAlpha(100)
                  : colors(context).baseContent,
            ),
          ),
          SizedBox(height: spacing(context).xs),
        ],
        DropdownButtonFormField<T>(
          initialValue: value,
          onChanged: disabled ? null : onChanged,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: TextStyle(
              color: colors(context).baseSubContent.withAlpha(100),
            ),
            contentPadding: _getContentPadding(context),
            prefixIcon: prefixIcon != null
                ? Icon(
                    prefixIcon,
                    size: _getIconSize(context),
                    color: _getIconColor(context),
                  )
                : null,
            border: OutlineInputBorder(
              borderRadius: radius(context).borderMd,
              borderSide: BorderSide(color: colors(context).base300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: radius(context).borderMd,
              borderSide: BorderSide(color: colors(context).base300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: radius(context).borderMd,
              borderSide: BorderSide(
                color: validationState.isInvalid
                    ? colors(context).error
                    : colors(context).primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: radius(context).borderMd,
              borderSide: BorderSide(color: colors(context).error),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: radius(context).borderMd,
              borderSide: BorderSide(color: colors(context).base300),
            ),
          ),
          style: TextStyle(
            fontSize: _getTextSize(context),
            color: colors(context).baseContent,
          ),
          dropdownColor: colors(context).base100,
          icon: Icon(
            Icons.keyboard_arrow_down,
            color: disabled
                ? colors(context).baseSubContent.withAlpha(100)
                : colors(context).baseSubContent,
          ),
          isExpanded: true,
          items: options.map((option) {
            return DropdownMenuItem<T>(
              value: option.value,
              child: Row(
                spacing: spacing(context).sm,
                children: [
                  if (option.icon != null)
                    Icon(
                      option.icon,
                      size: _getIconSize(context),
                      color: colors(context).baseSubContent,
                    ),
                  Expanded(
                    child: Text(
                      option.label,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
        if (_shouldShowHelperText) ...[
          SizedBox(height: spacing(context).xs),
          Text(
            _getHelperText,
            style: TextStyle(
              fontSize: typography(context).xs,
              color: _getHelperTextColor(context),
            ),
          ),
        ],
      ],
    );
  }

  bool get _shouldShowHelperText {
    return (validationState.isInvalid && errorText != null) ||
        (helperText != null && !validationState.isInvalid);
  }

  String get _getHelperText {
    if (validationState.isInvalid && errorText != null) {
      return errorText!;
    }
    return helperText ?? '';
  }

  Color _getHelperTextColor(BuildContext context) {
    if (validationState.isInvalid) return colors(context).error;
    if (validationState.isValid) return colors(context).success;
    if (validationState == ValidationState.warning) {
      return colors(context).warning;
    }
    return colors(context).baseSubContent;
  }

  Color _getIconColor(BuildContext context) {
    if (disabled) return colors(context).baseSubContent.withAlpha(100);
    if (validationState.isInvalid) return colors(context).error;
    if (validationState.isValid) return colors(context).success;
    return colors(context).baseSubContent;
  }

  EdgeInsets _getContentPadding(BuildContext context) {
    final space = spacing(context);
    return switch (size) {
      DropdownSize.small => EdgeInsets.symmetric(
          horizontal: space.sm,
          vertical: space.xs,
        ),
      DropdownSize.medium => EdgeInsets.symmetric(
          horizontal: space.md,
          vertical: space.sm,
        ),
      DropdownSize.large => EdgeInsets.symmetric(
          horizontal: space.lg,
          vertical: space.md,
        ),
    };
  }

  double _getTextSize(BuildContext context) {
    return switch (size) {
      DropdownSize.small => typography(context).sm,
      DropdownSize.medium => typography(context).base,
      DropdownSize.large => typography(context).lg,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      DropdownSize.small => sizing(context).iconSm,
      DropdownSize.medium => sizing(context).iconMd,
      DropdownSize.large => sizing(context).iconLg,
    };
  }
}
