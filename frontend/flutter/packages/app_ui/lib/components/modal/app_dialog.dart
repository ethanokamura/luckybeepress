import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';

/// A simple alert/confirmation dialog
class AppDialog extends AppWidget {
  const AppDialog({
    super.key,
    this.title,
    required this.content,
    this.actions = const [],
    this.icon,
    this.variant = SemanticVariant.neutral,
  });

  final String? title;
  final Widget content;
  final List<Widget> actions;
  final IconData? icon;
  final SemanticVariant variant;

  /// Show a confirmation dialog
  static Future<bool?> showConfirmation({
    required BuildContext context,
    String? title,
    required String message,
    String confirmText = 'Confirm',
    String cancelText = 'Cancel',
    SemanticVariant variant = SemanticVariant.neutral,
    IconData? icon,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AppDialog(
        title: title,
        content: Text(message),
        icon: icon,
        variant: variant,
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(cancelText),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(confirmText),
          ),
        ],
      ),
    );
  }

  /// Show an alert dialog
  static Future<void> showAlert({
    required BuildContext context,
    String? title,
    required String message,
    String buttonText = 'OK',
    SemanticVariant variant = SemanticVariant.info,
    IconData? icon,
  }) {
    return showDialog(
      context: context,
      builder: (context) => AppDialog(
        title: title,
        content: Text(message),
        icon: icon,
        variant: variant,
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(buttonText),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: radius(context).borderLg,
      ),
      child: Padding(
        padding: spacing(context).allLg,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Container(
                padding: spacing(context).allMd,
                decoration: BoxDecoration(
                  color: _getIconBackgroundColor(context),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: sizing(context).iconXl,
                  color: _getIconColor(context),
                ),
              ),
              SizedBox(height: spacing(context).md),
            ],
            if (title != null) ...[
              Text(
                title!,
                style: TextStyle(
                  fontSize: typography(context).xl,
                  fontWeight: typography(context).bold,
                  color: colors(context).baseContent,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: spacing(context).sm),
            ],
            DefaultTextStyle(
              style: TextStyle(
                fontSize: typography(context).base,
                color: colors(context).baseSubContent,
              ),
              textAlign: TextAlign.center,
              child: content,
            ),
            if (actions.isNotEmpty) ...[
              SizedBox(height: spacing(context).lg),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                spacing: spacing(context).sm,
                children: actions,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getIconColor(BuildContext context) {
    return switch (variant) {
      SemanticVariant.success => colors(context).success,
      SemanticVariant.warning => colors(context).warning,
      SemanticVariant.error => colors(context).error,
      SemanticVariant.info => colors(context).info,
      SemanticVariant.neutral => colors(context).primary,
    };
  }

  Color _getIconBackgroundColor(BuildContext context) {
    return _getIconColor(context).withAlpha(26); // 10% opacity
  }
}
