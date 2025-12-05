import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'loading_enums.dart';

/// A progress indicator component (linear or circular with value)
class AppProgress extends AppWidget {
  const AppProgress({
    super.key,
    required this.value,
    this.variant = LoadingVariant.linear,
    this.size = LoadingSize.medium,
    this.color,
    this.backgroundColor,
    this.showPercentage = false,
    this.strokeWidth,
  });

  final double value; // 0.0 to 1.0
  final LoadingVariant variant;
  final LoadingSize size;
  final Color? color;
  final Color? backgroundColor;
  final bool showPercentage;
  final double? strokeWidth;

  @override
  Widget build(BuildContext context) {
    if (variant.isCircular) {
      return _buildCircularProgress(context);
    }
    return _buildLinearProgress(context);
  }

  Widget _buildLinearProgress(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ClipRRect(
          borderRadius: radius(context).borderFull,
          child: SizedBox(
            height: _getLinearHeight(),
            child: LinearProgressIndicator(
              value: value,
              backgroundColor: backgroundColor ?? colors(context).base300,
              valueColor: AlwaysStoppedAnimation<Color>(
                color ?? colors(context).primary,
              ),
            ),
          ),
        ),
        if (showPercentage) ...[
          SizedBox(height: spacing(context).xs),
          Text(
            '${(value * 100).toInt()}%',
            style: TextStyle(
              fontSize: typography(context).sm,
              color: colors(context).baseSubContent,
            ),
            textAlign: TextAlign.right,
          ),
        ],
      ],
    );
  }

  Widget _buildCircularProgress(BuildContext context) {
    final progressSize = _getCircularSize();

    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: progressSize,
          height: progressSize,
          child: CircularProgressIndicator(
            value: value,
            strokeWidth: strokeWidth ?? _getStrokeWidth(),
            backgroundColor: backgroundColor ?? colors(context).base300,
            valueColor: AlwaysStoppedAnimation<Color>(
              color ?? colors(context).primary,
            ),
          ),
        ),
        if (showPercentage)
          Text(
            '${(value * 100).toInt()}%',
            style: TextStyle(
              fontSize: _getPercentageFontSize(context),
              fontWeight: typography(context).semiBold,
              color: colors(context).baseContent,
            ),
          ),
      ],
    );
  }

  double _getLinearHeight() {
    return switch (size) {
      LoadingSize.small => 4.0,
      LoadingSize.medium => 8.0,
      LoadingSize.large => 12.0,
    };
  }

  double _getCircularSize() {
    return switch (size) {
      LoadingSize.small => 40.0,
      LoadingSize.medium => 60.0,
      LoadingSize.large => 80.0,
    };
  }

  double _getStrokeWidth() {
    return switch (size) {
      LoadingSize.small => 3.0,
      LoadingSize.medium => 4.0,
      LoadingSize.large => 6.0,
    };
  }

  double _getPercentageFontSize(BuildContext context) {
    return switch (size) {
      LoadingSize.small => typography(context).xs,
      LoadingSize.medium => typography(context).sm,
      LoadingSize.large => typography(context).base,
    };
  }
}

/// A stepped progress indicator
class AppStepProgress extends AppWidget {
  const AppStepProgress({
    super.key,
    required this.currentStep,
    required this.totalSteps,
    this.color,
    this.backgroundColor,
  });

  final int currentStep;
  final int totalSteps;
  final Color? color;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: spacing(context).xs,
      children: List.generate(
        totalSteps,
        (index) => Expanded(
          child: Container(
            height: 4,
            decoration: BoxDecoration(
              color: index < currentStep
                  ? (color ?? colors(context).primary)
                  : (backgroundColor ?? colors(context).base300),
              borderRadius: radius(context).borderFull,
            ),
          ),
        ),
      ),
    );
  }
}
