import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'cart_items_cubit.dart';

class CartItemsCubitWrapper extends StatelessWidget {
  const CartItemsCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, CartItemsState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForCartItemsFailures<CartItemsCubit, CartItemsState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<CartItemsCubit, CartItemsState>(
        builder: builder,
      ),
    );
  }
}
