import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'customers_cubit.dart';

class CustomersCubitWrapper extends StatelessWidget {
  const CustomersCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, CustomersState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForCustomersFailures<CustomersCubit, CustomersState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<CustomersCubit, CustomersState>(
        builder: builder,
      ),
    );
  }
}
