/// Loading indicator size
enum LoadingSize {
  small,
  medium,
  large;

  bool get isSmall => this == LoadingSize.small;
  bool get isMedium => this == LoadingSize.medium;
  bool get isLarge => this == LoadingSize.large;
}

/// Loading indicator variant
enum LoadingVariant {
  circular,
  linear;

  bool get isCircular => this == LoadingVariant.circular;
  bool get isLinear => this == LoadingVariant.linear;
}
