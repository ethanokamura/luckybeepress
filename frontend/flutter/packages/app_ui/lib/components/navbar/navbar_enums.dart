/// Navbar height variants
enum NavbarHeight {
  compact,
  standard,
  extended;

  double get height {
    return switch (this) {
      NavbarHeight.compact => 48.0,
      NavbarHeight.standard => 56.0,
      NavbarHeight.extended => 64.0,
    };
  }
}
