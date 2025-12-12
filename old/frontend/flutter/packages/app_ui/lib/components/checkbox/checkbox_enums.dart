/// Checkbox size variants
enum CheckboxSize {
  small,
  medium,
  large;

  bool get isSmall => this == CheckboxSize.small;
  bool get isMedium => this == CheckboxSize.medium;
  bool get isLarge => this == CheckboxSize.large;
}
