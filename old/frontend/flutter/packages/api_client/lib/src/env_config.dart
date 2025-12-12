class ApiConfig {
  static const apiEndpointUrl = String.fromEnvironment('API_ENDPOINT_URL');
  static const apiVersion = String.fromEnvironment('API_VERSION');
  static const auth0Domain = String.fromEnvironment('AUTH0_DOMAIN');
  static const auth0ClientId = String.fromEnvironment('AUTH0_CLIENT_ID');
  static const auth0Audience = String.fromEnvironment('AUTH0_AUDIENCE');
}
