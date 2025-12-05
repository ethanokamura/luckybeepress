import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'orders_cubit.dart';

class OrdersCubitWrapper extends StatelessWidget {
  const OrdersCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, OrdersState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForOrdersFailures<OrdersCubit, OrdersState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<OrdersCubit, OrdersState>(
        builder: builder,
      ),
    );
  }
}
