/// Toggle/Switch size variants
enum ToggleSize {
  small,
  medium,
  large;

  bool get isSmall => this == ToggleSize.small;
  bool get isMedium => this == ToggleSize.medium;
  bool get isLarge => this == ToggleSize.large;
}
