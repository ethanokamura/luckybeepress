import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/base_widget.dart';
import '../../core/enums.dart';

/// A customizable link/hyperlink component
class AppLink extends AppWidget {
  const AppLink({
    super.key,
    required this.text,
    required this.url,
    this.icon,
    this.iconPosition = IconPosition.trailing,
    this.color,
    this.hoverColor,
    this.underline = true,
    this.visited = false,
    this.disabled = false,
    this.fontSize,
    this.fontWeight,
  });

  final String text;
  final String url;
  final IconData? icon;
  final IconPosition iconPosition;
  final Color? color;
  final Color? hoverColor;
  final bool underline;
  final bool visited;
  final bool disabled;
  final double? fontSize;
  final FontWeight? fontWeight;

  /// Create an external link (with external icon)
  const AppLink.external({
    super.key,
    required this.text,
    required this.url,
    this.color,
    this.hoverColor,
    this.underline = true,
    this.disabled = false,
    this.fontSize,
    this.fontWeight,
  })  : icon = Icons.open_in_new,
        iconPosition = IconPosition.trailing,
        visited = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor:
          disabled ? SystemMouseCursors.forbidden : SystemMouseCursors.click,
      child: _LinkContent(
        text: text,
        url: url,
        icon: icon,
        iconPosition: iconPosition,
        color: color,
        hoverColor: hoverColor,
        underline: underline,
        visited: visited,
        disabled: disabled,
        fontSize: fontSize,
        fontWeight: fontWeight,
      ),
    );
  }
}

class _LinkContent extends AppStatefulWidget {
  const _LinkContent({
    required this.text,
    required this.url,
    this.icon,
    this.iconPosition = IconPosition.trailing,
    this.color,
    this.hoverColor,
    this.underline = true,
    this.visited = false,
    this.disabled = false,
    this.fontSize,
    this.fontWeight,
  });

  final String text;
  final String url;
  final IconData? icon;
  final IconPosition iconPosition;
  final Color? color;
  final Color? hoverColor;
  final bool underline;
  final bool visited;
  final bool disabled;
  final double? fontSize;
  final FontWeight? fontWeight;

  @override
  State<_LinkContent> createState() => _LinkContentState();
}

class _LinkContentState extends AppState<_LinkContent> {
  bool _isHovered = false;

  String parsedURL(String url) {
    var newURL = url;
    final uri = Uri.tryParse(url);
    if (uri == null || !uri.hasScheme) {
      newURL = 'https://$url';
    }
    return newURL;
  }

  Future<void> launchParsedUrl(String url) async {
    final uri = Uri.parse(parsedURL(url));
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final linkColor = widget.disabled
        ? colors.baseSubContent.withAlpha(100)
        : widget.visited
            ? colors.primary.withAlpha(179) // 70% opacity
            : widget.color ?? colors.primary;

    final currentColor = _isHovered && !widget.disabled
        ? (widget.hoverColor ?? colors.primary)
        : linkColor;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: () => launchParsedUrl(widget.url),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: spacing.xs,
          children: [
            if (widget.icon != null && widget.iconPosition.isLeading)
              Icon(
                widget.icon,
                size: widget.fontSize ?? typography.base,
                color: currentColor,
              ),
            Text(
              widget.text,
              style: TextStyle(
                fontSize: widget.fontSize ?? typography.base,
                fontWeight: widget.fontWeight ?? typography.regular,
                color: currentColor,
                decoration: widget.underline
                    ? TextDecoration.underline
                    : TextDecoration.none,
                decorationColor: currentColor,
              ),
            ),
            if (widget.icon != null && widget.iconPosition.isTrailing)
              Icon(
                widget.icon,
                size: widget.fontSize ?? typography.base,
                color: currentColor,
              ),
          ],
        ),
      ),
    );
  }
}
