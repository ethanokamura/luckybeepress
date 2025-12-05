import 'package:app_core/app_core.dart';

class CredentialsFailure extends Failure {
  const CredentialsFailure._();
  factory CredentialsFailure.fromGet() => const ReadFailure();
  factory CredentialsFailure.fromSignIn() => const SignInFailure();
  factory CredentialsFailure.fromSignOut() => const SignOutFailure();
  factory CredentialsFailure.fromAuthChanges() => const AuthChangesFailure();
  factory CredentialsFailure.fromTokenFailure() => const TokenFailure();

  static const empty = EmptyFailure();
}

class AuthChangesFailure extends CredentialsFailure {
  const AuthChangesFailure() : super._();

  @override
  bool get needsReauthentication => true;
}

class ReadFailure extends CredentialsFailure {
  const ReadFailure() : super._();
}

class SignInFailure extends CredentialsFailure {
  const SignInFailure() : super._();
}

class SignOutFailure extends CredentialsFailure {
  const SignOutFailure() : super._();
}

class TokenFailure extends CredentialsFailure {
  const TokenFailure() : super._();
}

class EmptyFailure extends CredentialsFailure {
  const EmptyFailure() : super._();
}
