import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'failures.dart';
import 'addresses_cubit.dart';

class AddressesCubitWrapper extends StatelessWidget {
  const AddressesCubitWrapper({
    required this.builder,
    super.key,
  });
  final Widget Function(BuildContext context, AddressesState state) builder;

  @override
  Widget build(BuildContext context) {
    return listenForAddressesFailures<AddressesCubit, AddressesState>(
      failureSelector: (state) => state.failure!,
      isFailureSelector: (state) => state.isFailure,
      child: BlocBuilder<AddressesCubit, AddressesState>(
        builder: builder,
      ),
    );
  }
}
