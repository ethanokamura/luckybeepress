// Export ValidationState from core enums
export '../../../../core/enums.dart' show ValidationState;

/// Input field size variants
enum InputSize {
  small,
  medium,
  large;

  bool get isSmall => this == InputSize.small;
  bool get isMedium => this == InputSize.medium;
  bool get isLarge => this == InputSize.large;
}

/// Input field variants
enum InputVariant {
  /// Standard outlined input
  outlined,

  /// Filled background input
  filled,

  /// Underlined input (no border, only bottom line)
  underlined;

  bool get isOutlined => this == InputVariant.outlined;
  bool get isFilled => this == InputVariant.filled;
  bool get isUnderlined => this == InputVariant.underlined;
}
