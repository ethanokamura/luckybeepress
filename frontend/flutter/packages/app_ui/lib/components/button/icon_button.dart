import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';
import '../../../../core/enums.dart';
import 'button_enums.dart';

/// A button that contains only an icon
class AppIconButton extends AppWidget {
  const AppIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.variant = ButtonVariant.ghost,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.tooltip,
    this.shape = ComponentShape.rounded,
    this.semanticLabel,
  });

  final IconData icon;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final String? tooltip;
  final ComponentShape shape;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final buttonSize = _getButtonSize(context);
    final iconSize = _getIconSize(context);
    final buttonColors = _getButtonColors(context);
    final buttonShape = _getShape(context);

    Widget buttonWidget = Material(
      color: buttonColors.background,
      shape: buttonShape,
      child: InkWell(
        onTap: isLoading ? null : onPressed,
        customBorder: buttonShape,
        child: Container(
          width: buttonSize,
          height: buttonSize,
          decoration: BoxDecoration(
            border: variant == ButtonVariant.outline
                ? Border.all(color: buttonColors.border!)
                : null,
            shape: shape == ComponentShape.circle
                ? BoxShape.circle
                : BoxShape.rectangle,
            borderRadius: shape == ComponentShape.rounded
                ? radius(context).borderMd
                : null,
          ),
          child: Center(
            child: isLoading
                ? SizedBox(
                    width: iconSize * 0.8,
                    height: iconSize * 0.8,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        buttonColors.icon,
                      ),
                    ),
                  )
                : Icon(
                    icon,
                    size: iconSize,
                    color: buttonColors.icon,
                  ),
          ),
        ),
      ),
    );

    Widget button = semanticLabel != null
        ? Semantics(
            label: semanticLabel,
            button: true,
            child: buttonWidget,
          )
        : buttonWidget;

    if (tooltip != null) {
      button = Tooltip(
        message: tooltip!,
        child: button,
      );
    }

    return button;
  }

  ShapeBorder _getShape(BuildContext context) {
    return switch (shape) {
      ComponentShape.circle => const CircleBorder(),
      ComponentShape.rounded => RoundedRectangleBorder(
          borderRadius: radius(context).borderMd,
        ),
      ComponentShape.stadium => const StadiumBorder(),
      ComponentShape.rectangle => const RoundedRectangleBorder(),
    };
  }

  double _getButtonSize(BuildContext context) {
    return switch (size) {
      ButtonSize.small => sizing(context).buttonSm,
      ButtonSize.medium => sizing(context).buttonMd,
      ButtonSize.large => sizing(context).buttonLg,
      ButtonSize.extraLarge => sizing(context).buttonXl,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      ButtonSize.small => sizing(context).iconSm,
      ButtonSize.medium => sizing(context).iconMd,
      ButtonSize.large => sizing(context).iconMd,
      ButtonSize.extraLarge => sizing(context).iconLg,
    };
  }

  _IconButtonColors _getButtonColors(BuildContext context) {
    final isDisabled = onPressed == null && !isLoading;
    final buttonColors = colors(context);

    if (isDisabled) {
      return _IconButtonColors(
        background: buttonColors.base300,
        icon: buttonColors.baseSubContent.withAlpha(100),
        border: buttonColors.base300,
      );
    }

    return switch (variant) {
      ButtonVariant.primary => _IconButtonColors(
          background: buttonColors.primary,
          icon: Colors.white,
        ),
      ButtonVariant.secondary => _IconButtonColors(
          background: buttonColors.secondary,
          icon: Colors.white,
        ),
      ButtonVariant.outline => _IconButtonColors(
          background: Colors.transparent,
          icon: buttonColors.primary,
          border: buttonColors.primary,
        ),
      ButtonVariant.ghost => _IconButtonColors(
          background: Colors.transparent,
          icon: buttonColors.baseContent,
        ),
      ButtonVariant.text => _IconButtonColors(
          background: Colors.transparent,
          icon: buttonColors.baseContent,
        ),
      ButtonVariant.surface => _IconButtonColors(
          background: buttonColors.base100,
          icon: buttonColors.baseContent,
        ),
      ButtonVariant.destructive => _IconButtonColors(
          background: buttonColors.error,
          icon: Colors.white,
        ),
    };
  }
}

class _IconButtonColors {
  final Color background;
  final Color icon;
  final Color? border;

  _IconButtonColors({
    required this.background,
    required this.icon,
    this.border,
  });
}
