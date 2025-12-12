import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'carts_cubit.dart';

class CartsCubitWrapper extends StatelessWidget {
  const CartsCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, CartsState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForCartsFailures<CartsCubit, CartsState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<CartsCubit, CartsState>(
        builder: builder,
      ),
    );
  }
}
