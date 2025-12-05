/// Tab alignment options
enum TabAlignment {
  start,
  center,
  end;

  bool get isStart => this == TabAlignment.start;
  bool get isCenter => this == TabAlignment.center;
  bool get isEnd => this == TabAlignment.end;
}

/// Tab indicator style
enum TabIndicatorStyle {
  underline,
  box,
  none;

  bool get isUnderline => this == TabIndicatorStyle.underline;
  bool get isBox => this == TabIndicatorStyle.box;
  bool get isNone => this == TabIndicatorStyle.none;
}
