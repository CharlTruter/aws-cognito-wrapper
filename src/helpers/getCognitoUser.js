import getUserPool from './getUserPool';

export default function getCognitoUser(username, userPoolId, clientId, CognitoUserPool,
  CognitoUser) {
  const userPool = getUserPool(userPoolId, clientId, CognitoUserPool);

  const userData = {
    Username: username,
    Pool: userPool,
  };

  return new CognitoUser(userData);
}
