import 'package:flutter/material.dart';

/// Common size variants used across components
enum ComponentSize {
  small,
  medium,
  large,
  extraLarge;

  /// Check if this is the small size
  bool get isSmall => this == ComponentSize.small;

  /// Check if this is the medium size
  bool get isMedium => this == ComponentSize.medium;

  /// Check if this is the large size
  bool get isLarge => this == ComponentSize.large;

  /// Check if this is the extra large size
  bool get isExtraLarge => this == ComponentSize.extraLarge;
}

/// Common variant/style types for components
enum ComponentVariant {
  primary,
  secondary,
  outline,
  ghost,
  text,
  link;

  /// Check if this is a filled variant (primary or secondary)
  bool get isFilled =>
      this == ComponentVariant.primary || this == ComponentVariant.secondary;

  /// Check if this has a transparent background
  bool get isTransparent =>
      this == ComponentVariant.ghost || this == ComponentVariant.text;
}

/// Semantic color variants for status indicators
enum SemanticVariant {
  success,
  warning,
  error,
  info,
  neutral;

  /// Check if this represents an error state
  bool get isError => this == SemanticVariant.error;

  /// Check if this represents a success state
  bool get isSuccess => this == SemanticVariant.success;
}

/// Alignment options for components
enum ComponentAlignment {
  start,
  center,
  end,
  spaceBetween,
  spaceAround,
  spaceEvenly;

  /// Convert to MainAxisAlignment
  MainAxisAlignment toMainAxisAlignment() {
    return switch (this) {
      ComponentAlignment.start => MainAxisAlignment.start,
      ComponentAlignment.center => MainAxisAlignment.center,
      ComponentAlignment.end => MainAxisAlignment.end,
      ComponentAlignment.spaceBetween => MainAxisAlignment.spaceBetween,
      ComponentAlignment.spaceAround => MainAxisAlignment.spaceAround,
      ComponentAlignment.spaceEvenly => MainAxisAlignment.spaceEvenly,
    };
  }

  /// Convert to CrossAxisAlignment
  CrossAxisAlignment toCrossAxisAlignment() {
    return switch (this) {
      ComponentAlignment.start => CrossAxisAlignment.start,
      ComponentAlignment.center => CrossAxisAlignment.center,
      ComponentAlignment.end => CrossAxisAlignment.end,
      _ => CrossAxisAlignment.center, // Default for non-applicable values
    };
  }
}

/// Direction for layouts
enum LayoutDirection {
  horizontal,
  vertical;

  /// Check if horizontal
  bool get isHorizontal => this == LayoutDirection.horizontal;

  /// Check if vertical
  bool get isVertical => this == LayoutDirection.vertical;

  /// Get the opposite direction
  LayoutDirection get opposite {
    return this == LayoutDirection.horizontal
        ? LayoutDirection.vertical
        : LayoutDirection.horizontal;
  }
}

/// Position options for components
enum ComponentPosition {
  top,
  bottom,
  left,
  right,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  center;

  /// Check if this is a corner position
  bool get isCorner => [
        ComponentPosition.topLeft,
        ComponentPosition.topRight,
        ComponentPosition.bottomLeft,
        ComponentPosition.bottomRight,
      ].contains(this);

  /// Check if this is an edge position
  bool get isEdge => [
        ComponentPosition.top,
        ComponentPosition.bottom,
        ComponentPosition.left,
        ComponentPosition.right,
      ].contains(this);
}

/// Loading state for components
enum LoadingState {
  idle,
  loading,
  success,
  error;

  /// Check if currently loading
  bool get isLoading => this == LoadingState.loading;

  /// Check if in success state
  bool get isSuccess => this == LoadingState.success;

  /// Check if in error state
  bool get isError => this == LoadingState.error;

  /// Check if idle
  bool get isIdle => this == LoadingState.idle;
}

/// Shape variants for components
enum ComponentShape {
  rectangle,
  rounded,
  circle,
  stadium; // Pill-shaped

  /// Check if this is a circular shape
  bool get isCircular => this == ComponentShape.circle;

  /// Check if this has rounded corners
  bool get hasRoundedCorners => this != ComponentShape.rectangle;
}

/// Density options for component spacing
enum ComponentDensity {
  compact,
  standard,
  comfortable;

  /// Get spacing multiplier for this density
  double get spacingMultiplier {
    return switch (this) {
      ComponentDensity.compact => 0.75,
      ComponentDensity.standard => 1.0,
      ComponentDensity.comfortable => 1.25,
    };
  }
}

/// Input validation state
enum ValidationState {
  none,
  valid,
  invalid,
  warning;

  /// Check if this is an error state
  bool get isInvalid => this == ValidationState.invalid;

  /// Check if this is a valid state
  bool get isValid => this == ValidationState.valid;

  /// Check if this has no validation
  bool get isNone => this == ValidationState.none;
}

/// Animation curve types
enum AnimationCurveType {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  fastOutSlowIn,
  bounceIn,
  bounceOut,
  elastic;

  /// Convert to Flutter Curve
  Curve toCurve() {
    return switch (this) {
      AnimationCurveType.linear => Curves.linear,
      AnimationCurveType.easeIn => Curves.easeIn,
      AnimationCurveType.easeOut => Curves.easeOut,
      AnimationCurveType.easeInOut => Curves.easeInOut,
      AnimationCurveType.fastOutSlowIn => Curves.fastOutSlowIn,
      AnimationCurveType.bounceIn => Curves.bounceIn,
      AnimationCurveType.bounceOut => Curves.bounceOut,
      AnimationCurveType.elastic => Curves.elasticOut,
    };
  }
}

/// Badge position relative to parent
enum BadgePosition {
  topRight,
  topLeft,
  bottomRight,
  bottomLeft;

  /// Convert to Alignment
  Alignment toAlignment() {
    return switch (this) {
      BadgePosition.topRight => Alignment.topRight,
      BadgePosition.topLeft => Alignment.topLeft,
      BadgePosition.bottomRight => Alignment.bottomRight,
      BadgePosition.bottomLeft => Alignment.bottomLeft,
    };
  }
}

/// Icon position relative to text in buttons/links
enum IconPosition {
  leading,
  trailing;

  /// Check if icon comes before text
  bool get isLeading => this == IconPosition.leading;

  /// Check if icon comes after text
  bool get isTrailing => this == IconPosition.trailing;
}
