part of 'authentication_cubit.dart';

/// Defines possible status of app.
enum AuthenticationStatus { unauthenticated, authenticated, loading, failure }

/// Auth Status Extenstions for public access to the current AuthenticationStatus
extension AuthenticationStatusExtensions on AuthenticationStatus {
  bool get isUnauthenticated => this == AuthenticationStatus.unauthenticated;
  bool get isAuthenticated => this == AuthenticationStatus.authenticated;
  bool get isFailure => this == AuthenticationStatus.failure;
  bool get isLoading => this == AuthenticationStatus.loading;
}

/// Keeps track of the apps current state.
final class AuthenticationState extends Equatable {
  /// AuthenticationState Constructor
  const AuthenticationState._({
    required this.status,
    this.failure = CredentialsFailure.empty,
  });

  /// Private setters for AuthenticationStatus
  const AuthenticationState.unauthenticated()
      : this._(status: AuthenticationStatus.unauthenticated);
  const AuthenticationState.authenticated()
      : this._(status: AuthenticationStatus.authenticated);
  const AuthenticationState.loading()
      : this._(status: AuthenticationStatus.loading);
  const AuthenticationState.fromFailure(CredentialsFailure failure)
      : this._(status: AuthenticationStatus.failure, failure: failure);

  // /// State properties
  final AuthenticationStatus status;
  // final UserData user;
  final CredentialsFailure failure;

  @override
  List<Object?> get props => [status, failure];
}

/// Public getters for AuthenticationState
extension AuthenticationStateExtensions on AuthenticationState {
  bool get isUnauthenticated => status.isUnauthenticated;
  bool get isAuthenticated => status.isAuthenticated;
  bool get isFailure => status.isFailure;
  bool get isLoading => status.isLoading;
}
