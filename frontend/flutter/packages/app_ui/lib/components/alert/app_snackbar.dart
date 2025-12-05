import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';
import 'alert_enums.dart';

/// A snackbar notification component
class AppSnackbar extends AppWidget {
  const AppSnackbar({
    super.key,
    required this.message,
    this.variant = SemanticVariant.neutral,
    this.icon,
    this.action,
    this.actionLabel,
    this.onActionPressed,
    this.duration = const Duration(seconds: 4),
  });

  final String message;
  final SemanticVariant variant;
  final IconData? icon;
  final Widget? action;
  final String? actionLabel;
  final VoidCallback? onActionPressed;
  final Duration duration;

  /// Show a snackbar
  static void show({
    required BuildContext context,
    required String message,
    SemanticVariant variant = SemanticVariant.neutral,
    IconData? icon,
    String? actionLabel,
    VoidCallback? onActionPressed,
    Duration duration = const Duration(seconds: 4),
  }) {
    final messenger = ScaffoldMessenger.of(context);
    messenger.clearSnackBars();
    messenger.showSnackBar(
      SnackBar(
        content: AppSnackbar(
          message: message,
          variant: variant,
          icon: icon,
          actionLabel: actionLabel,
          onActionPressed: onActionPressed,
          duration: duration,
        ),
        duration: duration,
        backgroundColor: Colors.transparent,
        elevation: 0,
        behavior: SnackBarBehavior.floating,
        padding: EdgeInsets.zero,
      ),
    );
  }

  /// Show a success snackbar
  static void showSuccess({
    required BuildContext context,
    required String message,
    String? actionLabel,
    VoidCallback? onActionPressed,
  }) {
    show(
      context: context,
      message: message,
      variant: SemanticVariant.success,
      icon: Icons.check_circle,
      actionLabel: actionLabel,
      onActionPressed: onActionPressed,
    );
  }

  /// Show an error snackbar
  static void showError({
    required BuildContext context,
    required String message,
    String? actionLabel,
    VoidCallback? onActionPressed,
  }) {
    show(
      context: context,
      message: message,
      variant: SemanticVariant.error,
      icon: Icons.error,
      actionLabel: actionLabel,
      onActionPressed: onActionPressed,
    );
  }

  /// Show a warning snackbar
  static void showWarning({
    required BuildContext context,
    required String message,
    String? actionLabel,
    VoidCallback? onActionPressed,
  }) {
    show(
      context: context,
      message: message,
      variant: SemanticVariant.warning,
      icon: Icons.warning,
      actionLabel: actionLabel,
      onActionPressed: onActionPressed,
    );
  }

  /// Show an info snackbar
  static void showInfo({
    required BuildContext context,
    required String message,
    String? actionLabel,
    VoidCallback? onActionPressed,
  }) {
    show(
      context: context,
      message: message,
      variant: SemanticVariant.info,
      icon: Icons.info,
      actionLabel: actionLabel,
      onActionPressed: onActionPressed,
    );
  }

  @override
  Widget build(BuildContext context) {
    final snackbarColor = _getSnackbarColor(context);

    return Container(
      padding: spacing(context).allMd,
      decoration: BoxDecoration(
        color: snackbarColor,
        borderRadius: radius(context).borderMd,
        boxShadow: shadows(context).lg,
      ),
      child: Row(
        spacing: spacing(context).sm,
        children: [
          if (icon != null)
            Icon(
              icon,
              size: sizing(context).iconMd,
              color: Colors.white,
            ),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                fontSize: typography(context).base,
                color: Colors.white,
              ),
            ),
          ),
          if (action != null)
            action!
          else if (actionLabel != null && onActionPressed != null)
            TextButton(
              onPressed: onActionPressed,
              style: TextButton.styleFrom(
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(
                  horizontal: spacing(context).sm,
                ),
              ),
              child: Text(
                actionLabel!,
                style: TextStyle(
                  fontWeight: typography(context).semiBold,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Color _getSnackbarColor(BuildContext context) {
    return switch (variant) {
      SemanticVariant.success => colors(context).success,
      SemanticVariant.warning => colors(context).warning,
      SemanticVariant.error => colors(context).error,
      SemanticVariant.info => colors(context).info,
      SemanticVariant.neutral => colors(context).baseContent,
    };
  }
}
