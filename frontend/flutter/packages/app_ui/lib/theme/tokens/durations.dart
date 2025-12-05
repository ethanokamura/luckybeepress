class AppDurations {
  const AppDurations({
    this.instant = const Duration(milliseconds: 100),
    this.fast = const Duration(milliseconds: 200),
    this.normal = const Duration(milliseconds: 300),
    this.slow = const Duration(milliseconds: 500),
    this.slower = const Duration(milliseconds: 700),
  });

  final Duration instant;
  final Duration fast;
  final Duration normal;
  final Duration slow;
  final Duration slower;
}
