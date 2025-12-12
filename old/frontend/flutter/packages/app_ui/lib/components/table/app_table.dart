import 'dart:math';

import 'package:app_ui/components/typography/app_text.dart';
import 'package:app_ui/theme/theme.dart';
import 'package:flutter/material.dart';

import '../../core/base_widget.dart';

class AppTable extends AppStatefulWidget {
  const AppTable({
    required this.maxWidth,
    required this.rows,
    this.tableHeaders = const [],
    this.columnWidths,
    this.semanticLabel = 'table',
    super.key,
  });
  final double maxWidth;
  final List<String> tableHeaders;
  final List<TableRow> rows;
  final Map<int, TableColumnWidth>? columnWidths;
  final String semanticLabel;
  @override
  State<AppTable> createState() => _AppTableState();
}

class _AppTableState extends State<AppTable> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalWidth = widget.tableHeaders.length * 120.0;
    return Semantics(
      label: widget.semanticLabel,
      child: Container(
        decoration: BoxDecoration(
          color: context.colors.base100,
          borderRadius: context.radius.borderMd,
          border: Border.all(
            color: context.colors.base300,
            width: 0.5,
          ),
          boxShadow: AppShadows().md,
        ),
        child: SingleChildScrollView(
          controller: _scrollController,
          scrollDirection: Axis.horizontal,
          physics: const AlwaysScrollableScrollPhysics(),
          child: SizedBox(
            width: max(totalWidth, widget.maxWidth),
            child: Table(
              columnWidths: widget.columnWidths,
              defaultColumnWidth: const FlexColumnWidth(50.0),
              border: TableBorder.symmetric(
                inside: BorderSide(
                  color: context.colors.baseSubContent.withAlpha(96),
                  width: 1,
                ),
              ),
              children: [
                TableRow(
                  decoration: BoxDecoration(
                    color: context.colors.base200,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(context.radius.md),
                      topRight: Radius.circular(context.radius.md),
                    ),
                  ),
                  children: List.generate(
                    widget.tableHeaders.length,
                    (index) => Padding(
                      padding: context.spacing.allXs,
                      child: AppText.bold(
                        widget.tableHeaders[index]
                            .replaceAll('_', ' ')
                            .toTitleCase,
                        maxLines: 1,
                      ),
                    ),
                  ),
                ),
                ...widget.rows,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
