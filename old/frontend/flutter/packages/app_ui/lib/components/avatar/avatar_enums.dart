export '../../core/enums.dart' show ComponentShape;

/// Avatar size variants
enum AvatarSize {
  xs,
  small,
  medium,
  large,
  xl;

  bool get isXs => this == AvatarSize.xs;
  bool get isSmall => this == AvatarSize.small;
  bool get isMedium => this == AvatarSize.medium;
  bool get isLarge => this == AvatarSize.large;
  bool get isXl => this == AvatarSize.xl;
}
