import 'package:app_core/app_core.dart';
import 'package:credentials_repository/credentials_repository.dart';

part 'authentication_state.dart';

class AuthenticationCubit extends Cubit<AuthenticationState> {
  /// Constructs AuthenticationCubit
  /// Takes in CredentialsRepository instance and sets the initial AuthenticationState.
  AuthenticationCubit({required CredentialsRepository credentialsRepository})
      : _credentialsRepository = credentialsRepository,
        super(_initialState(credentialsRepository));

  final CredentialsRepository _credentialsRepository;

  /// Sets initial auth state for the app
  /// Checks to see the current status of user authetication
  static AuthenticationState _initialState(
    CredentialsRepository credentialsRepository,
  ) {
    return credentialsRepository.authenticated
        ? const AuthenticationState.authenticated()
        : const AuthenticationState.unauthenticated();
  }

  void verifyAuthentication() {
    _credentialsRepository.authenticated
        ? emit(const AuthenticationState.authenticated())
        : emit(const AuthenticationState.unauthenticated());
  }

  Future<void> login() async {
    emit(const AuthenticationState.loading());
    try {
      await _credentialsRepository.login().then((_) => verifyAuthentication());
    } on CredentialsFailure catch (failure) {
      emit(AuthenticationState.fromFailure(failure));
    }
  }

  Future<void> logout() async {
    emit(const AuthenticationState.loading());
    try {
      await _credentialsRepository.logout().then((_) => verifyAuthentication());
    } on CredentialsFailure catch (failure) {
      emit(AuthenticationState.fromFailure(failure));
    }
  }
}
