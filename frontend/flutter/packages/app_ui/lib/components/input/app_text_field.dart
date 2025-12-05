import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/base_widget.dart';
import 'input_enums.dart';

/// A customizable text input field
class AppTextField extends AppWidget {
  const AppTextField({
    super.key,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.validationState = ValidationState.none,
    this.controller,
    this.onChanged,
    this.onTap,
    this.onSubmitted,
    this.size = InputSize.medium,
    this.variant = InputVariant.outlined,
    this.enabled = true,
    this.readOnly = false,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixIconTap,
    this.prefix,
    this.suffix,
    this.keyboardType,
    this.inputFormatters,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.showCounter,
    this.focusNode,
    this.textCapitalization = TextCapitalization.none,
    this.textInputAction,
    this.semanticLabel = 'app-text-field',
  });

  final String? label;
  final String? placeholder;
  final String? helperText;
  final String? errorText;
  final ValidationState validationState;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final ValueChanged<String>? onSubmitted;
  final InputSize size;
  final InputVariant variant;
  final bool enabled;
  final bool readOnly;
  final bool obscureText;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final VoidCallback? onSuffixIconTap;
  final Widget? prefix;
  final Widget? suffix;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final bool? showCounter;
  final FocusNode? focusNode;
  final TextCapitalization textCapitalization;
  final TextInputAction? textInputAction;
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (label != null) ...[
            Text(
              label!,
              style: TextStyle(
                fontSize: typography(context).sm,
                fontWeight: typography(context).medium,
                color: enabled
                    ? colors(context).baseContent
                    : colors(context).baseSubContent.withAlpha(100),
              ),
            ),
            SizedBox(height: spacing(context).xs),
          ],
          TextField(
            controller: controller,
            focusNode: focusNode,
            enabled: enabled,
            readOnly: readOnly,
            obscureText: obscureText,
            onChanged: onChanged,
            onTap: onTap,
            onSubmitted: onSubmitted,
            keyboardType: keyboardType,
            textCapitalization: textCapitalization,
            textInputAction: textInputAction,
            inputFormatters: inputFormatters,
            maxLines: obscureText ? 1 : maxLines,
            minLines: minLines,
            maxLength: maxLength,
            style: TextStyle(
              fontSize: _getTextSize(context),
              color: enabled
                  ? colors(context).baseContent
                  : colors(context).baseSubContent.withAlpha(100),
            ),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: TextStyle(
                color: colors(context).baseSubContent.withAlpha(100),
              ),
              contentPadding: _getContentPadding(context),
              filled: variant == InputVariant.filled,
              fillColor: variant == InputVariant.filled
                  ? colors(context).base300
                  : null,
              prefixIcon: prefixIcon != null
                  ? Icon(
                      prefixIcon,
                      size: _getIconSize(context),
                      color: _getIconColor(context),
                    )
                  : null,
              prefix: prefix,
              suffixIcon: suffixIcon != null
                  ? IconButton(
                      icon: Icon(
                        suffixIcon,
                        size: _getIconSize(context),
                        color: _getIconColor(context),
                      ),
                      onPressed: onSuffixIconTap,
                    )
                  : null,
              suffix: suffix,
              border: _getBorder(context),
              enabledBorder: _getBorder(context),
              focusedBorder: _getFocusedBorder(context),
              errorBorder: _getErrorBorder(context),
              focusedErrorBorder: _getErrorBorder(context),
              disabledBorder: _getDisabledBorder(context),
              counterText: showCounter == false ? '' : null,
            ),
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
      ),
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
    if (!enabled) return colors(context).baseSubContent.withAlpha(100);
    if (validationState.isInvalid) return colors(context).error;
    if (validationState.isValid) return colors(context).success;
    return colors(context).baseSubContent;
  }

  EdgeInsets _getContentPadding(BuildContext context) {
    final space = spacing(context);
    return switch (size) {
      InputSize.small => EdgeInsets.symmetric(
          horizontal: space.sm,
          vertical: space.xs,
        ),
      InputSize.medium => EdgeInsets.symmetric(
          horizontal: space.md,
          vertical: space.sm,
        ),
      InputSize.large => EdgeInsets.symmetric(
          horizontal: space.lg,
          vertical: space.md,
        ),
    };
  }

  double _getTextSize(BuildContext context) {
    return switch (size) {
      InputSize.small => typography(context).sm,
      InputSize.medium => typography(context).base,
      InputSize.large => typography(context).lg,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      InputSize.small => sizing(context).iconSm,
      InputSize.medium => sizing(context).iconMd,
      InputSize.large => sizing(context).iconLg,
    };
  }

  InputBorder _getBorder(BuildContext context) {
    if (variant == InputVariant.underlined) {
      return UnderlineInputBorder(
        borderSide: BorderSide(color: colors(context).base300),
      );
    }

    if (variant == InputVariant.filled) {
      return OutlineInputBorder(
        borderRadius: radius(context).borderMd,
        borderSide: BorderSide.none,
      );
    }

    return OutlineInputBorder(
      borderRadius: radius(context).borderMd,
      borderSide: BorderSide(color: colors(context).base300),
    );
  }

  InputBorder _getFocusedBorder(BuildContext context) {
    final borderColor = validationState.isInvalid
        ? colors(context).error
        : validationState.isValid
            ? colors(context).success
            : colors(context).primary;

    if (variant == InputVariant.underlined) {
      return UnderlineInputBorder(
        borderSide: BorderSide(color: borderColor, width: 2),
      );
    }

    if (variant == InputVariant.filled) {
      return OutlineInputBorder(
        borderRadius: radius(context).borderMd,
        borderSide: BorderSide(color: borderColor, width: 2),
      );
    }

    return OutlineInputBorder(
      borderRadius: radius(context).borderMd,
      borderSide: BorderSide(color: borderColor, width: 2),
    );
  }

  InputBorder _getErrorBorder(BuildContext context) {
    if (variant == InputVariant.underlined) {
      return UnderlineInputBorder(
        borderSide: BorderSide(color: colors(context).error),
      );
    }

    if (variant == InputVariant.filled) {
      return OutlineInputBorder(
        borderRadius: radius(context).borderMd,
        borderSide: BorderSide(color: colors(context).error),
      );
    }

    return OutlineInputBorder(
      borderRadius: radius(context).borderMd,
      borderSide: BorderSide(color: colors(context).error),
    );
  }

  InputBorder _getDisabledBorder(BuildContext context) {
    if (variant == InputVariant.underlined) {
      return UnderlineInputBorder(
        borderSide: BorderSide(color: colors(context).base300),
      );
    }

    if (variant == InputVariant.filled) {
      return OutlineInputBorder(
        borderRadius: radius(context).borderMd,
        borderSide: BorderSide.none,
      );
    }

    return OutlineInputBorder(
      borderRadius: radius(context).borderMd,
      borderSide: BorderSide(color: colors(context).base300),
    );
  }
}
