/// Button style variants
enum ButtonVariant {
  /// Solid background with primary color
  primary,

  /// Solid background with secondary color
  secondary,

  /// Outlined button with transparent background
  outline,

  /// Transparent background with subtle hover
  ghost,

  /// Text-only button, no background or border
  text,

  /// Text-only button, no background or border
  surface,

  /// Destructive/dangerous action
  destructive;

  bool get isFilled =>
      this == ButtonVariant.primary ||
      this == ButtonVariant.secondary ||
      this == ButtonVariant.surface ||
      this == ButtonVariant.destructive;

  bool get isTransparent =>
      this == ButtonVariant.ghost || this == ButtonVariant.text;
}

/// Button size variants
enum ButtonSize {
  small,
  medium,
  large,
  extraLarge;

  bool get isSmall => this == ButtonSize.small;
  bool get isMedium => this == ButtonSize.medium;
  bool get isLarge => this == ButtonSize.large;
  bool get isExtraLarge => this == ButtonSize.extraLarge;
}

/// Button loading state position
enum ButtonLoadingPosition {
  /// Replace button content with loading indicator
  replace,

  /// Show loading indicator before text
  leading,

  /// Show loading indicator after text
  trailing;
}
