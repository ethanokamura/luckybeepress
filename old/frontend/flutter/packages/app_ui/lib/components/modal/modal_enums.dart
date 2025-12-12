/// Modal size variants
enum ModalSize {
  small,
  medium,
  large,
  fullscreen;

  bool get isFullscreen => this == ModalSize.fullscreen;
}

/// Modal animation type
enum ModalAnimation {
  fade,
  slide,
  scale;
}
