import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'modal_enums.dart';

/// A customizable modal/dialog component
class AppModal extends AppWidget {
  const AppModal({
    super.key,
    required this.child,
    this.size = ModalSize.medium,
    this.showCloseButton = true,
    this.onClose,
    this.title,
    this.padding,
    this.backgroundColor,
    this.barrierDismissible = true,
  });

  final Widget child;
  final ModalSize size;
  final bool showCloseButton;
  final VoidCallback? onClose;
  final String? title;
  final EdgeInsets? padding;
  final Color? backgroundColor;
  final bool barrierDismissible;

  /// Show this modal
  static Future<T?> show<T>({
    required BuildContext context,
    required Widget child,
    ModalSize size = ModalSize.medium,
    bool showCloseButton = true,
    VoidCallback? onClose,
    String? title,
    EdgeInsets? padding,
    Color? backgroundColor,
    bool barrierDismissible = true,
  }) {
    return showDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (context) => AppModal(
        size: size,
        showCloseButton: showCloseButton,
        onClose: onClose,
        title: title,
        padding: padding,
        backgroundColor: backgroundColor,
        barrierDismissible: barrierDismissible,
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final modalPadding = padding ?? spacing(context).allLg;
    final bgColor = backgroundColor ?? colors(context).base100;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: _getInsetPadding(context),
      child: Container(
        constraints: _getConstraints(context),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: size.isFullscreen ? null : radius(context).borderLg,
          boxShadow: shadows(context).xl,
        ),
        child: Column(
          mainAxisSize: size.isFullscreen ? MainAxisSize.max : MainAxisSize.min,
          children: [
            if (title != null || showCloseButton)
              _ModalHeader(
                title: title,
                showCloseButton: showCloseButton,
                onClose: onClose ?? () => Navigator.of(context).pop(),
              ),
            Flexible(
              child: SingleChildScrollView(
                padding: modalPadding,
                child: child,
              ),
            ),
          ],
        ),
      ),
    );
  }

  EdgeInsets _getInsetPadding(BuildContext context) {
    if (size.isFullscreen) {
      return EdgeInsets.zero;
    }

    final space = spacing(context);
    return switch (size) {
      ModalSize.small => EdgeInsets.symmetric(
          horizontal: space.xxxl,
          vertical: space.xxl,
        ),
      ModalSize.medium => EdgeInsets.all(space.xl),
      ModalSize.large => EdgeInsets.all(space.lg),
      ModalSize.fullscreen => EdgeInsets.zero,
    };
  }

  BoxConstraints _getConstraints(BuildContext context) {
    if (size.isFullscreen) {
      return const BoxConstraints.expand();
    }

    return switch (size) {
      ModalSize.small => const BoxConstraints(maxWidth: 400),
      ModalSize.medium => const BoxConstraints(maxWidth: 600),
      ModalSize.large => const BoxConstraints(maxWidth: 800),
      ModalSize.fullscreen => const BoxConstraints.expand(),
    };
  }
}

class _ModalHeader extends AppWidget {
  const _ModalHeader({
    this.title,
    required this.showCloseButton,
    required this.onClose,
  });

  final String? title;
  final bool showCloseButton;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: spacing(context).allLg,
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: colors(context).base300,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          if (title != null)
            Expanded(
              child: Text(
                title!,
                style: TextStyle(
                  fontSize: typography(context).lg,
                  fontWeight: typography(context).semiBold,
                  color: colors(context).baseContent,
                ),
              ),
            ),
          if (showCloseButton)
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: onClose,
              iconSize: sizing(context).iconMd,
              color: colors(context).baseSubContent,
            ),
        ],
      ),
    );
  }
}
