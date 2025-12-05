export '../../core/enums.dart' show BadgePosition, ComponentShape;

/// Badge size variants
enum BadgeSize {
  small,
  medium,
  large;

  bool get isSmall => this == BadgeSize.small;
  bool get isMedium => this == BadgeSize.medium;
  bool get isLarge => this == BadgeSize.large;
}

/// Badge variant types
enum BadgeVariant {
  filled,
  outlined,
  dot;

  bool get isFilled => this == BadgeVariant.filled;
  bool get isOutlined => this == BadgeVariant.outlined;
  bool get isDot => this == BadgeVariant.dot;
}
