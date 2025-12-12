import 'package:flutter/material.dart';
import '../../../../core/base_widget.dart';
import '../../../../core/enums.dart';
import 'button_enums.dart';

/// A customizable button component with multiple variants and sizes
class AppButton extends AppWidget {
  const AppButton({
    super.key,
    this.text,
    this.child,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.loadingPosition = ButtonLoadingPosition.replace,
    this.icon,
    this.iconPosition,
    this.fullWidth = false,
    this.borderRadius,
    this.padding,
    this.semanticLabel,
  }) : assert(
          text != null || child != null,
          'Either text or child must be provided',
        );

  final String? text;
  final Widget? child;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final ButtonLoadingPosition loadingPosition;
  final IconData? icon;
  final IconPosition? iconPosition;
  final bool fullWidth;
  final BorderRadius? borderRadius;
  final EdgeInsets? padding;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final buttonColors = _getButtonColors(context);
    final buttonPadding = padding ?? _getButtonPadding(context);
    final buttonRadius = borderRadius ?? _getButtonRadius(context);
    final buttonHeight = _getButtonHeight(context);
    final iconSize = _getIconSize(context);

    Widget buttonChild = _buildButtonContent(context, iconSize);

    final buttonWidget = Material(
      color: buttonColors.background,
      borderRadius: buttonRadius,
      child: InkWell(
        onTap: isLoading ? null : onPressed,
        borderRadius: buttonRadius,
        child: Container(
          height: buttonHeight,
          padding: buttonPadding,
          decoration: BoxDecoration(
            border: variant == ButtonVariant.outline
                ? Border.all(color: buttonColors.border!)
                : null,
            borderRadius: buttonRadius,
          ),
          child: Center(child: buttonChild),
        ),
      ),
    );

    final button = semanticLabel != null
        ? Semantics(
            label: semanticLabel,
            button: true,
            child: buttonWidget,
          )
        : buttonWidget;

    if (fullWidth) {
      return SizedBox(width: double.infinity, child: button);
    }

    return button;
  }

  Widget _buildButtonContent(BuildContext context, double iconSize) {
    if (isLoading && loadingPosition == ButtonLoadingPosition.replace) {
      return _buildLoadingIndicator(context);
    }

    final textWidget = child ??
        Text(
          text!,
          style: TextStyle(
            fontSize: _getTextSize(context),
            fontWeight: typography(context).medium,
            color: _getButtonColors(context).text,
          ),
        );

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isLoading && loadingPosition == ButtonLoadingPosition.leading)
            Padding(
              padding: EdgeInsets.only(right: spacing(context).xs),
              child: _buildLoadingIndicator(context),
            ),
          if (iconPosition == IconPosition.leading && !isLoading) ...[
            Icon(
              icon,
              size: iconSize,
              color: _getButtonColors(context).text,
            ),
            SizedBox(width: spacing(context).xs),
          ],
          textWidget,
          if (iconPosition == IconPosition.trailing && !isLoading) ...[
            SizedBox(width: spacing(context).xs),
            Icon(
              icon,
              size: iconSize,
              color: _getButtonColors(context).text,
            ),
          ],
          if (isLoading && loadingPosition == ButtonLoadingPosition.trailing)
            Padding(
              padding: EdgeInsets.only(left: spacing(context).xs),
              child: _buildLoadingIndicator(context),
            ),
        ],
      );
    }

    return textWidget;
  }

  Widget _buildLoadingIndicator(BuildContext context) {
    final indicatorSize = size == ButtonSize.small ? 16.0 : 20.0;
    return SizedBox(
      width: indicatorSize,
      height: indicatorSize,
      child: CircularProgressIndicator(
        strokeWidth: 2,
        valueColor: AlwaysStoppedAnimation<Color>(
          _getButtonColors(context).text,
        ),
      ),
    );
  }

  _ButtonColors _getButtonColors(BuildContext context) {
    final isDisabled = onPressed == null && !isLoading;
    final buttonColors = colors(context);

    if (isDisabled) {
      return _ButtonColors(
        background: buttonColors.base300,
        text: buttonColors.baseContent.withAlpha(100),
        border: buttonColors.base300,
      );
    }

    return switch (variant) {
      ButtonVariant.primary => _ButtonColors(
          background: buttonColors.primary,
          text: Colors.white,
        ),
      ButtonVariant.secondary => _ButtonColors(
          background: buttonColors.secondary,
          text: Colors.white,
        ),
      ButtonVariant.outline => _ButtonColors(
          background: Colors.transparent,
          text: buttonColors.primary,
          border: buttonColors.primary,
        ),
      ButtonVariant.ghost => _ButtonColors(
          background: Colors.transparent,
          text: buttonColors.primary,
        ),
      ButtonVariant.text => _ButtonColors(
          background: Colors.transparent,
          text: buttonColors.baseContent,
        ),
      ButtonVariant.surface => _ButtonColors(
          background: buttonColors.base100,
          text: buttonColors.baseContent,
        ),
      ButtonVariant.destructive => _ButtonColors(
          background: buttonColors.error,
          text: Colors.white,
        ),
    };
  }

  EdgeInsets _getButtonPadding(BuildContext context) {
    final space = spacing(context);
    return switch (size) {
      ButtonSize.small => EdgeInsets.symmetric(
          horizontal: space.sm,
          vertical: space.xxs,
        ),
      ButtonSize.medium => EdgeInsets.symmetric(
          horizontal: space.md,
          vertical: space.xs,
        ),
      ButtonSize.large => EdgeInsets.symmetric(
          horizontal: space.lg,
          vertical: space.sm,
        ),
      ButtonSize.extraLarge => EdgeInsets.symmetric(
          horizontal: space.xl,
          vertical: space.md,
        ),
    };
  }

  BorderRadius _getButtonRadius(BuildContext context) {
    return switch (size) {
      ButtonSize.small => radius(context).borderSm,
      ButtonSize.medium => radius(context).borderMd,
      ButtonSize.large => radius(context).borderMd,
      ButtonSize.extraLarge => radius(context).borderLg,
    };
  }

  double _getButtonHeight(BuildContext context) {
    return switch (size) {
      ButtonSize.small => sizing(context).buttonSm,
      ButtonSize.medium => sizing(context).buttonMd,
      ButtonSize.large => sizing(context).buttonLg,
      ButtonSize.extraLarge => sizing(context).buttonXl,
    };
  }

  double _getTextSize(BuildContext context) {
    return switch (size) {
      ButtonSize.small => typography(context).sm,
      ButtonSize.medium => typography(context).base,
      ButtonSize.large => typography(context).lg,
      ButtonSize.extraLarge => typography(context).xl,
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
}

class _ButtonColors {
  final Color background;
  final Color text;
  final Color? border;

  _ButtonColors({
    required this.background,
    required this.text,
    this.border,
  });
}
