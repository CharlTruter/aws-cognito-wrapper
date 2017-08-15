export default function getAuthenticationDetails(username, password, AuthenticationDetails) {
  const authenticationData = {
    Username: username,
    Password: password,
  };

  return new AuthenticationDetails(authenticationData);
}
