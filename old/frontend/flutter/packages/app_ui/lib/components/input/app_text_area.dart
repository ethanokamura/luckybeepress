import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';
import 'app_text_field.dart';
import 'input_enums.dart';

/// A multi-line text input field
class AppTextArea extends AppWidget {
  const AppTextArea({
    super.key,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.validationState = ValidationState.none,
    this.controller,
    this.onChanged,
    this.onSubmitted,
    this.size = InputSize.medium,
    this.variant = InputVariant.outlined,
    this.enabled = true,
    this.readOnly = false,
    this.minLines = 3,
    this.maxLines = 6,
    this.maxLength,
    this.showCounter,
    this.focusNode,
    this.semanticLabel = 'app-text-area',
  });

  final String? label;
  final String? placeholder;
  final String? helperText;
  final String? errorText;
  final ValidationState validationState;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final InputSize size;
  final InputVariant variant;
  final bool enabled;
  final bool readOnly;
  final int minLines;
  final int? maxLines;
  final int? maxLength;
  final bool? showCounter;
  final FocusNode? focusNode;
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel,
      child: AppTextField(
        label: label,
        placeholder: placeholder,
        helperText: helperText,
        errorText: errorText,
        validationState: validationState,
        controller: controller,
        onChanged: onChanged,
        onSubmitted: onSubmitted,
        size: size,
        variant: variant,
        enabled: enabled,
        readOnly: readOnly,
        minLines: minLines,
        maxLines: maxLines,
        maxLength: maxLength,
        showCounter: showCounter,
        focusNode: focusNode,
        keyboardType: TextInputType.multiline,
        textInputAction: TextInputAction.newline,
      ),
    );
  }
}
