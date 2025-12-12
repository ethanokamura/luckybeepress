import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'order_items_cubit.dart';

class OrderItemsCubitWrapper extends StatelessWidget {
  const OrderItemsCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, OrderItemsState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForOrderItemsFailures<OrderItemsCubit, OrderItemsState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<OrderItemsCubit, OrderItemsState>(
        builder: builder,
      ),
    );
  }
}
