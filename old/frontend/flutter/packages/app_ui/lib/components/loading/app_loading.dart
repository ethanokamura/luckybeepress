import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'loading_enums.dart';

/// A loading indicator component
class AppLoading extends AppWidget {
  const AppLoading({
    super.key,
    this.size = LoadingSize.medium,
    this.color,
    this.strokeWidth,
  });

  final LoadingSize size;
  final Color? color;
  final double? strokeWidth;

  @override
  Widget build(BuildContext context) {
    final indicatorSize = _getSize(context);
    final indicatorStrokeWidth = strokeWidth ?? _getStrokeWidth();

    return SizedBox(
      width: indicatorSize,
      height: indicatorSize,
      child: CircularProgressIndicator(
        strokeWidth: indicatorStrokeWidth,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? colors(context).primary,
        ),
      ),
    );
  }

  double _getSize(BuildContext context) {
    return switch (size) {
      LoadingSize.small => 16.0,
      LoadingSize.medium => 24.0,
      LoadingSize.large => 48.0,
    };
  }

  double _getStrokeWidth() {
    return switch (size) {
      LoadingSize.small => 2.0,
      LoadingSize.medium => 3.0,
      LoadingSize.large => 4.0,
    };
  }
}
