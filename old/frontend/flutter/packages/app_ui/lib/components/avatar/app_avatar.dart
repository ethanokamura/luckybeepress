import 'package:flutter/material.dart';
import '../../core/base_widget.dart';
import 'avatar_enums.dart';

/// A customizable avatar component
class AppAvatar extends AppWidget {
  const AppAvatar({
    super.key,
    this.imageUrl,
    this.imagePath,
    this.initials,
    this.icon,
    this.size = AvatarSize.medium,
    this.shape = ComponentShape.circle,
    this.backgroundColor,
    this.foregroundColor,
    this.borderColor,
    this.borderWidth,
    this.showStatusIndicator = false,
    this.isOnline = false,
    this.onTap,
  });

  final String? imageUrl;
  final String? imagePath;
  final String? initials;
  final IconData? icon;
  final AvatarSize size;
  final ComponentShape shape;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? borderColor;
  final double? borderWidth;
  final bool showStatusIndicator;
  final bool isOnline;
  final VoidCallback? onTap;

  /// Create an avatar with initials
  const AppAvatar.initials({
    super.key,
    required this.initials,
    this.size = AvatarSize.medium,
    this.shape = ComponentShape.circle,
    this.backgroundColor,
    this.foregroundColor,
    this.borderColor,
    this.borderWidth,
    this.showStatusIndicator = false,
    this.isOnline = false,
    this.onTap,
  })  : imageUrl = null,
        imagePath = null,
        icon = null;

  /// Create an avatar with an icon
  const AppAvatar.icon({
    super.key,
    required this.icon,
    this.size = AvatarSize.medium,
    this.shape = ComponentShape.circle,
    this.backgroundColor,
    this.foregroundColor,
    this.borderColor,
    this.borderWidth,
    this.onTap,
  })  : imageUrl = null,
        imagePath = null,
        initials = null,
        showStatusIndicator = false,
        isOnline = false;

  @override
  Widget build(BuildContext context) {
    final avatarSize = _getAvatarSize(context);
    final bgColor = backgroundColor ?? colors(context).primary;

    Widget avatarContent;

    if (imageUrl != null) {
      avatarContent = Image.network(
        imageUrl!,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _buildFallback(context),
      );
    } else if (imagePath != null) {
      avatarContent = Image.asset(
        imagePath!,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _buildFallback(context),
      );
    } else {
      avatarContent = _buildFallback(context);
    }

    Widget avatar = Container(
      width: avatarSize,
      height: avatarSize,
      decoration: BoxDecoration(
        color: bgColor,
        shape: shape == ComponentShape.circle
            ? BoxShape.circle
            : BoxShape.rectangle,
        borderRadius: shape == ComponentShape.circle
            ? null
            : shape == ComponentShape.rounded
                ? radius(context).borderMd
                : BorderRadius.zero,
        border: borderWidth != null
            ? Border.all(
                color: borderColor ?? colors(context).base300,
                width: borderWidth!,
              )
            : null,
      ),
      clipBehavior: Clip.antiAlias,
      child: avatarContent,
    );

    if (showStatusIndicator) {
      avatar = Stack(
        clipBehavior: Clip.none,
        children: [
          avatar,
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: _getStatusIndicatorSize(),
              height: _getStatusIndicatorSize(),
              decoration: BoxDecoration(
                color: isOnline
                    ? colors(context).success
                    : colors(context).base300,
                shape: BoxShape.circle,
                border: Border.all(
                  color: colors(context).base100,
                  width: 2,
                ),
              ),
            ),
          ),
        ],
      );
    }

    if (onTap != null) {
      avatar = InkWell(
        onTap: onTap,
        borderRadius: shape == ComponentShape.circle
            ? BorderRadius.circular(avatarSize / 2)
            : radius(context).borderMd,
        child: avatar,
      );
    }

    return avatar;
  }

  Widget _buildFallback(BuildContext context) {
    final fgColor = foregroundColor ?? Colors.white;

    if (initials != null) {
      return Center(
        child: Text(
          initials!,
          style: TextStyle(
            fontSize: _getInitialsFontSize(context),
            fontWeight: typography(context).semiBold,
            color: fgColor,
          ),
        ),
      );
    }

    if (icon != null) {
      return Center(
        child: Icon(
          icon,
          size: _getIconSize(context),
          color: fgColor,
        ),
      );
    }

    return Center(
      child: Icon(
        Icons.person,
        size: _getIconSize(context),
        color: fgColor,
      ),
    );
  }

  double _getAvatarSize(BuildContext context) {
    return switch (size) {
      AvatarSize.xs => 24.0,
      AvatarSize.small => sizing(context).avatarSm,
      AvatarSize.medium => sizing(context).avatarMd,
      AvatarSize.large => sizing(context).avatarLg,
      AvatarSize.xl => sizing(context).avatarXl,
    };
  }

  double _getInitialsFontSize(BuildContext context) {
    return switch (size) {
      AvatarSize.xs => typography(context).xs,
      AvatarSize.small => typography(context).sm,
      AvatarSize.medium => typography(context).base,
      AvatarSize.large => typography(context).lg,
      AvatarSize.xl => typography(context).xl,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      AvatarSize.xs => sizing(context).iconXs,
      AvatarSize.small => sizing(context).iconSm,
      AvatarSize.medium => sizing(context).iconMd,
      AvatarSize.large => sizing(context).iconLg,
      AvatarSize.xl => sizing(context).iconXl,
    };
  }

  double _getStatusIndicatorSize() {
    return switch (size) {
      AvatarSize.xs => 6.0,
      AvatarSize.small => 8.0,
      AvatarSize.medium => 10.0,
      AvatarSize.large => 12.0,
      AvatarSize.xl => 14.0,
    };
  }
}

/// A group of overlapping avatars
class AppAvatarGroup extends AppWidget {
  const AppAvatarGroup({
    super.key,
    required this.avatars,
    this.size = AvatarSize.medium,
    this.max = 3,
    this.avatarSpacing = 8.0,
  });

  final List<AppAvatar> avatars;
  final AvatarSize size;
  final int max;
  final double avatarSpacing;

  @override
  Widget build(BuildContext context) {
    final visibleAvatars = avatars.take(max).toList();
    final remainingCount = avatars.length - max;

    return SizedBox(
      height: _getAvatarSize(context),
      child: Stack(
        children: [
          ...List.generate(
            visibleAvatars.length,
            (index) => Positioned(
              left: index * avatarSpacing,
              child: visibleAvatars[index],
            ),
          ),
          if (remainingCount > 0)
            Positioned(
              left: visibleAvatars.length * avatarSpacing,
              child: AppAvatar(
                initials: '+$remainingCount',
                size: size,
                backgroundColor: colors(context).base100,
                foregroundColor: colors(context).baseSubContent,
              ),
            ),
        ],
      ),
    );
  }

  double _getAvatarSize(BuildContext context) {
    return switch (size) {
      AvatarSize.xs => 24.0,
      AvatarSize.small => sizing(context).avatarSm,
      AvatarSize.medium => sizing(context).avatarMd,
      AvatarSize.large => sizing(context).avatarLg,
      AvatarSize.xl => sizing(context).avatarXl,
    };
  }
}
