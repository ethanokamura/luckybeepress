/// Dropdown size variants
enum DropdownSize {
  small,
  medium,
  large;

  bool get isSmall => this == DropdownSize.small;
  bool get isMedium => this == DropdownSize.medium;
  bool get isLarge => this == DropdownSize.large;
}
