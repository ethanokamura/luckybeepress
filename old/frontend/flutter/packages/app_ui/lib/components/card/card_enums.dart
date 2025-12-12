/// Card elevation/shadow variants
enum CardElevation {
  none,
  small,
  medium,
  large;

  bool get hasElevation => this != CardElevation.none;
}

/// Card variant styles
enum CardVariant {
  /// Standard card with elevation
  elevated,

  /// Card with border, no elevation
  outlined,

  /// Flat card with subtle background
  filled;

  bool get isElevated => this == CardVariant.elevated;
  bool get isOutlined => this == CardVariant.outlined;
  bool get isFilled => this == CardVariant.filled;
}
