import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'chip_enums.dart';

/// A customizable chip component
class AppChip extends AppWidget {
  const AppChip({
    super.key,
    required this.label,
    this.variant = ChipVariant.filled,
    this.size = ChipSize.medium,
    this.onTap,
    this.onDelete,
    this.avatar,
    this.icon,
    this.selected = false,
    this.color,
    this.textColor,
    this.deleteIcon,
    this.disabled = false,
  });

  final String label;
  final ChipVariant variant;
  final ChipSize size;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final Widget? avatar;
  final IconData? icon;
  final bool selected;
  final Color? color;
  final Color? textColor;
  final IconData? deleteIcon;
  final bool disabled;

  /// Create a filter chip (selectable)
  const AppChip.filter({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.variant = ChipVariant.outlined,
    this.size = ChipSize.medium,
    this.icon,
    this.color,
    this.textColor,
    this.disabled = false,
  })  : onDelete = null,
        avatar = null,
        deleteIcon = null;

  /// Create an input chip (deletable)
  const AppChip.input({
    super.key,
    required this.label,
    required this.onDelete,
    this.variant = ChipVariant.filled,
    this.size = ChipSize.medium,
    this.avatar,
    this.icon,
    this.color,
    this.textColor,
    this.deleteIcon,
    this.disabled = false,
  })  : onTap = null,
        selected = false;

  @override
  Widget build(BuildContext context) {
    final chipColors = _getChipColors(context);
    final isClickable = onTap != null && !disabled;

    return Material(
      color: chipColors.background,
      elevation: variant.isElevated ? 2 : 0,
      shape: RoundedRectangleBorder(
        borderRadius: radius(context).borderFull,
        side: variant.isOutlined
            ? BorderSide(
                color: chipColors.border ?? colors(context).base300,
                width: 1,
              )
            : BorderSide.none,
      ),
      child: InkWell(
        onTap: isClickable ? onTap : null,
        borderRadius: radius(context).borderFull,
        child: Container(
          padding: _getPadding(context),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: spacing(context).xs,
            children: [
              if (avatar != null)
                SizedBox(
                  width: _getAvatarSize(),
                  height: _getAvatarSize(),
                  child: avatar,
                )
              else if (icon != null)
                Icon(
                  icon,
                  size: _getIconSize(context),
                  color: chipColors.icon,
                ),
              Text(
                label,
                style: TextStyle(
                  fontSize: _getTextSize(context),
                  fontWeight: typography(context).medium,
                  color: chipColors.text,
                ),
              ),
              if (onDelete != null)
                InkWell(
                  onTap: disabled ? null : onDelete,
                  borderRadius: radius(context).borderFull,
                  child: Icon(
                    deleteIcon ?? Icons.close,
                    size: _getIconSize(context),
                    color: chipColors.icon,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  _ChipColors _getChipColors(BuildContext context) {
    final baseColor = color ?? colors(context).primary;
    final isDisabled = disabled;

    if (isDisabled) {
      return _ChipColors(
        background: colors(context).base300,
        text: colors(context).baseSubContent.withAlpha(100),
        icon: colors(context).baseSubContent.withAlpha(100),
        border: colors(context).base300,
      );
    }

    if (selected) {
      return _ChipColors(
        background: baseColor,
        text: textColor ?? Colors.white,
        icon: textColor ?? Colors.white,
        border: baseColor,
      );
    }

    return switch (variant) {
      ChipVariant.filled => _ChipColors(
          background: baseColor.withAlpha(26), // 10% opacity
          text: textColor ?? colors(context).baseContent,
          icon: baseColor,
          border: null,
        ),
      ChipVariant.outlined => _ChipColors(
          background: Colors.transparent,
          text: textColor ?? colors(context).baseContent,
          icon: baseColor,
          border: baseColor,
        ),
      ChipVariant.elevated => _ChipColors(
          background: colors(context).base100,
          text: textColor ?? colors(context).baseContent,
          icon: baseColor,
          border: null,
        ),
    };
  }

  EdgeInsets _getPadding(BuildContext context) {
    final space = spacing(context);
    return switch (size) {
      ChipSize.small => EdgeInsets.symmetric(
          horizontal: space.xs,
          vertical: space.xxs,
        ),
      ChipSize.medium => EdgeInsets.symmetric(
          horizontal: space.sm,
          vertical: space.xs,
        ),
      ChipSize.large => EdgeInsets.symmetric(
          horizontal: space.md,
          vertical: space.sm,
        ),
    };
  }

  double _getTextSize(BuildContext context) {
    return switch (size) {
      ChipSize.small => typography(context).xs,
      ChipSize.medium => typography(context).sm,
      ChipSize.large => typography(context).base,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      ChipSize.small => sizing(context).iconXs,
      ChipSize.medium => sizing(context).iconSm,
      ChipSize.large => sizing(context).iconMd,
    };
  }

  double _getAvatarSize() {
    return switch (size) {
      ChipSize.small => 20.0,
      ChipSize.medium => 24.0,
      ChipSize.large => 32.0,
    };
  }
}

class _ChipColors {
  const _ChipColors({
    required this.background,
    required this.text,
    required this.icon,
    this.border,
  });

  final Color background;
  final Color text;
  final Color icon;
  final Color? border;
}
