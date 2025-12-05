import 'package:flutter/material.dart';
import '../../core/base_widget.dart';

/// Empty state size variants
enum EmptyStateSize {
  small,
  medium,
  large;
}

/// A customizable empty state component
class AppEmptyState extends AppWidget {
  const AppEmptyState({
    super.key,
    required this.title,
    this.subtitle,
    this.description,
    this.icon,
    this.illustration,
    this.action,
    this.secondaryAction,
    this.size = EmptyStateSize.medium,
  });

  final String title;
  final String? subtitle;
  final String? description;
  final IconData? icon;
  final Widget? illustration;
  final Widget? action;
  final Widget? secondaryAction;
  final EmptyStateSize size;

  /// Create an empty state for no data
  const AppEmptyState.noData({
    super.key,
    this.title = 'No data available',
    this.subtitle = 'There is no data to display at this time.',
    this.description,
    this.icon = Icons.inbox_outlined,
    this.action,
    this.secondaryAction,
    this.size = EmptyStateSize.medium,
  }) : illustration = null;

  /// Create an empty state for no results
  const AppEmptyState.noResults({
    super.key,
    this.title = 'No results found',
    this.subtitle = 'Try adjusting your search or filters.',
    this.description,
    this.icon = Icons.search_off_outlined,
    this.action,
    this.secondaryAction,
    this.size = EmptyStateSize.medium,
  }) : illustration = null;

  /// Create an empty state for errors
  const AppEmptyState.error({
    super.key,
    this.title = 'Something went wrong',
    this.subtitle = 'We encountered an error. Please try again.',
    this.description,
    this.icon = Icons.error_outline,
    this.action,
    this.secondaryAction,
    this.size = EmptyStateSize.medium,
  }) : illustration = null;

  /// Create an empty state for no network
  const AppEmptyState.noNetwork({
    super.key,
    this.title = 'No internet connection',
    this.subtitle = 'Please check your network settings and try again.',
    this.description,
    this.icon = Icons.wifi_off_outlined,
    this.action,
    this.secondaryAction,
    this.size = EmptyStateSize.medium,
  }) : illustration = null;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: spacing(context).allXl,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: spacing(context).lg,
          children: [
            if (illustration != null)
              SizedBox(
                width: _getIllustrationSize(),
                height: _getIllustrationSize(),
                child: illustration,
              )
            else if (icon != null)
              Container(
                padding: spacing(context).allLg,
                decoration: BoxDecoration(
                  color: colors(context).base300,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: _getIconSize(context),
                  color: colors(context).baseSubContent,
                ),
              ),
            Column(
              mainAxisSize: MainAxisSize.min,
              spacing: spacing(context).sm,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: _getTitleSize(context),
                    fontWeight: typography(context).semiBold,
                    color: colors(context).baseContent,
                  ),
                  textAlign: TextAlign.center,
                ),
                if (subtitle != null)
                  Text(
                    subtitle!,
                    style: TextStyle(
                      fontSize: _getSubtitleSize(context),
                      color: colors(context).baseSubContent,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 3,
                  ),
                if (description != null)
                  Text(
                    description!,
                    style: TextStyle(
                      fontSize: _getDescriptionSize(context),
                      color: colors(context).baseSubContent,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 5,
                  ),
              ],
            ),
            if (action != null || secondaryAction != null)
              Column(
                mainAxisSize: MainAxisSize.min,
                spacing: spacing(context).sm,
                children: [
                  if (action != null) action!,
                  if (secondaryAction != null) secondaryAction!,
                ],
              ),
          ],
        ),
      ),
    );
  }

  double _getIllustrationSize() {
    return switch (size) {
      EmptyStateSize.small => 120.0,
      EmptyStateSize.medium => 200.0,
      EmptyStateSize.large => 280.0,
    };
  }

  double _getIconSize(BuildContext context) {
    return switch (size) {
      EmptyStateSize.small => sizing(context).iconLg,
      EmptyStateSize.medium => sizing(context).iconXl,
      EmptyStateSize.large => 64.0,
    };
  }

  double _getTitleSize(BuildContext context) {
    return switch (size) {
      EmptyStateSize.small => typography(context).base,
      EmptyStateSize.medium => typography(context).lg,
      EmptyStateSize.large => typography(context).xl,
    };
  }

  double _getSubtitleSize(BuildContext context) {
    return switch (size) {
      EmptyStateSize.small => typography(context).sm,
      EmptyStateSize.medium => typography(context).base,
      EmptyStateSize.large => typography(context).lg,
    };
  }

  double _getDescriptionSize(BuildContext context) {
    return switch (size) {
      EmptyStateSize.small => typography(context).xs,
      EmptyStateSize.medium => typography(context).sm,
      EmptyStateSize.large => typography(context).base,
    };
  }
}

/// A simple empty state placeholder for lists
class AppEmptyListPlaceholder extends AppWidget {
  const AppEmptyListPlaceholder({
    super.key,
    this.message = 'No items to display',
    this.icon = Icons.inbox_outlined,
  });

  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: spacing(context).allXl,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        spacing: spacing(context).md,
        children: [
          Icon(
            icon,
            size: sizing(context).iconXl,
            color: colors(context).baseSubContent.withAlpha(100),
          ),
          Text(
            message,
            style: TextStyle(
              fontSize: typography(context).base,
              color: colors(context).baseSubContent,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
