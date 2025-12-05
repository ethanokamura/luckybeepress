import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';

/// An inline alert/banner component
class AppAlert extends AppWidget {
  const AppAlert({
    super.key,
    required this.message,
    this.title,
    this.variant = SemanticVariant.info,
    this.icon,
    this.onClose,
    this.action,
  });

  final String message;
  final String? title;
  final SemanticVariant variant;
  final IconData? icon;
  final VoidCallback? onClose;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final alertColors = _getAlertColors(context);
    final alertIcon = icon ?? _getDefaultIcon();

    return Container(
      padding: spacing(context).allMd,
      decoration: BoxDecoration(
        color: alertColors.background,
        borderRadius: radius(context).borderMd,
        border: Border.all(color: alertColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: spacing(context).sm,
        children: [
          Icon(
            alertIcon,
            size: sizing(context).iconMd,
            color: alertColors.icon,
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              spacing: spacing(context).xxs,
              children: [
                if (title != null)
                  Text(
                    title!,
                    style: TextStyle(
                      fontSize: typography(context).base,
                      fontWeight: typography(context).semiBold,
                      color: alertColors.text,
                    ),
                  ),
                Text(
                  message,
                  style: TextStyle(
                    fontSize: typography(context).sm,
                    color: alertColors.text,
                  ),
                ),
                if (action != null) ...[
                  SizedBox(height: spacing(context).xs),
                  action!,
                ],
              ],
            ),
          ),
          if (onClose != null)
            IconButton(
              icon: const Icon(Icons.close),
              iconSize: sizing(context).iconSm,
              color: alertColors.icon,
              onPressed: onClose,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }

  _AlertColors _getAlertColors(BuildContext context) {
    final baseColor = switch (variant) {
      SemanticVariant.success => colors(context).success,
      SemanticVariant.warning => colors(context).warning,
      SemanticVariant.error => colors(context).error,
      SemanticVariant.info => colors(context).info,
      SemanticVariant.neutral => colors(context).baseSubContent,
    };

    return _AlertColors(
      background: baseColor.withAlpha(26), // 10% opacity
      border: baseColor.withAlpha(51), // 20% opacity
      icon: baseColor,
      text: colors(context).baseContent,
    );
  }

  IconData _getDefaultIcon() {
    return switch (variant) {
      SemanticVariant.success => Icons.check_circle_outline,
      SemanticVariant.warning => Icons.warning_amber_outlined,
      SemanticVariant.error => Icons.error_outline,
      SemanticVariant.info => Icons.info_outline,
      SemanticVariant.neutral => Icons.info_outline,
    };
  }
}

class _AlertColors {
  const _AlertColors({
    required this.background,
    required this.border,
    required this.icon,
    required this.text,
  });

  final Color background;
  final Color border;
  final Color icon;
  final Color text;
}
