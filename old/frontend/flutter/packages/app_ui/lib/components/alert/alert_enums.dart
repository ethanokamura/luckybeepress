export '../../core/enums.dart' show SemanticVariant;

/// Alert display position
enum AlertPosition {
  top,
  bottom;

  bool get isTop => this == AlertPosition.top;
  bool get isBottom => this == AlertPosition.bottom;
}
