import 'package:app_ui/app_ui.dart';
import 'package:app_core/app_core.dart';
import 'package:carts_repository/carts_repository.dart';
import 'package:go_router/go_router.dart';
import '../cubit/cubit.dart';

class CartsPage extends AppWidget {
  const CartsPage({super.key});
  @override
  Widget build(BuildContext context) {
    const table = 'carts';
    return AppPage(
      leading: AppIconButton(
        icon: Icons.arrow_back_ios,
        onPressed: () => context.pop(),
      ),
      title: 'Carts',
      body: CartsCubitWrapper(
        builder: (context, state) {
          return AppList(
            child: AppColumn(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppHeading.h2(
                  '${table.replaceAll('_', ' ').toTitleCase} Data',
                ),
                Center(
                  child: AppTable(
                    semanticLabel: '${table.replaceAll('_', '-')}-table',
                    maxWidth:
                        MediaQuery.widthOf(context) - (2 * context.spacing.md),
                    tableHeaders: ['Key', 'Value', 'Nullable'],
                    rows: [
                      TableRow(
                        key: ObjectKey('id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('id'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
                          ),
                        ],
                      ),
                      TableRow(
                        key: ObjectKey('customer_id'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('customer_id'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('No'),
                          ),
                        ],
                      ),
                      TableRow(
                        key: ObjectKey('status'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('status'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('String'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
                          ),
                        ],
                      ),
                      TableRow(
                        key: ObjectKey('created_at'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('created_at'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
                          ),
                        ],
                      ),
                      TableRow(
                        key: ObjectKey('updated_at'),
                        children: [
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('updated_at'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('DateTime?'),
                          ),
                          Padding(
                            padding: context.spacing.allXs,
                            child: AppText('Yes'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                AppSpacer(),
                AppRow(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    AppHeading.h3('Carts List'),
                    Row(
                      children: [
                        AppIconButton(
                          semanticLabel: 'refresh-carts-list',
                          onPressed: () async =>
                              BlocProvider.of<CartsCubit>(context)
                                  .fetchCartsList(
                            forceRefresh: true,
                            pageNumber: 0,
                          ),
                          icon: Icons.refresh,
                        ),
                        AppIconButton(
                          semanticLabel: 'add-new-carts',
                          onPressed: () async => context.push('/carts/create'),
                          icon: Icons.add,
                        ),
                      ],
                    )
                  ],
                ),
                if (state.cartsList.isEmpty) AppText.sm('No carts yet'),
                ...List.generate(
                  state.isLoading ? 10 : state.cartsList.length,
                  (index) => state.isLoading
                      ? SkeletonCartsCard(key: ObjectKey(index.toString()))
                      : CartsCard(
                          key: ObjectKey(state.cartsList[index].id),
                          carts: state.cartsList[index],
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class CartsCard extends AppWidget {
  const CartsCard({required this.carts, super.key});
  final Carts carts;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText(carts.id)),
          AppIconButton(
            semanticLabel: 'edit-carts-${carts.id}',
            onPressed: () async => context.push(
              '/carts/edit/${carts.id}',
            ),
            icon: Icons.edit_note_outlined,
          ),
          AppIconButton(
            semanticLabel: 'delete-carts-${carts.id}',
            onPressed: () async =>
                BlocProvider.of<CartsCubit>(context).deleteCarts(id: carts.id),
            icon: Icons.delete_forever_rounded,
          ),
        ],
      ),
    );
  }
}

class SkeletonCartsCard extends AppWidget {
  const SkeletonCartsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Expanded(child: AppText('unknown user')),
          AppIconButton(
            onPressed: () {},
            icon: Icons.delete_forever_rounded,
          )
        ],
      ),
    );
  }
}
