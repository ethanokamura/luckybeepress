import 'package:app_core/app_core.dart';
import 'package:app_ui/app_ui.dart';
import 'package:customers_repository/customers_repository.dart';

/// Handles failures from the repository by checking the state for a failure
/// and displaying a user-friendly message via a SnackBar.
///
/// @param failureSelector A function to extract the [CustomersFailure] from the cubit state [S].
/// @param isFailureSelector A function to check if the current cubit state [S] indicates a failure.
/// @param child The widget tree to wrap.
BlocListener<C, S> listenForCustomersFailures<C extends Cubit<S>, S>({
  required CustomersFailure Function(S state) failureSelector,
  required bool Function(S state) isFailureSelector,
  required Widget child,
}) {
  return BlocListener<C, S>(
    listenWhen: (previous, current) =>
        !isFailureSelector(previous) && isFailureSelector(current),
    listener: (context, state) {
      if (isFailureSelector(state)) {
        final failure = failureSelector(state);
        final message = failure.userMessage;
        AppSnackbar.showError(
          context: context,
          message: message,
        );
      }
    },
    child: child,
  );
}
