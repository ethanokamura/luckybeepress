import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'products_cubit.dart';

class ProductsCubitWrapper extends StatelessWidget {
  const ProductsCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, ProductsState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForProductsFailures<ProductsCubit, ProductsState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<ProductsCubit, ProductsState>(
        builder: builder,
      ),
    );
  }
}
