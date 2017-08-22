export default function getUserPool(userPoolId, clientId, CognitoUserPool) {
  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };

  return new CognitoUserPool(poolData);
}
