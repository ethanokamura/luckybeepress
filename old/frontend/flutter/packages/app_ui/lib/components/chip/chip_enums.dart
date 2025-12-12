/// Chip variant types
enum ChipVariant {
  filled,
  outlined,
  elevated;

  bool get isFilled => this == ChipVariant.filled;
  bool get isOutlined => this == ChipVariant.outlined;
  bool get isElevated => this == ChipVariant.elevated;
}

/// Chip size variants
enum ChipSize {
  small,
  medium,
  large;

  bool get isSmall => this == ChipSize.small;
  bool get isMedium => this == ChipSize.medium;
  bool get isLarge => this == ChipSize.large;
}
