import getAuthenticationDetails from './helpers/getAuthenticationDetails';
import getCognitoUser from './helpers/getCognitoUser';
import getUserPool from './helpers/getUserPool';
import getCognitoUserAttributes from './helpers/getCognitoUserAttributes';
import getGenericPromiseCallback from './helpers/getGenericPromiseCallback';
import getGenericPromiseCallbackObject from './helpers/getGenericPromiseCallbackObject';

const userService = class UserService {
  constructor(awsCognito) {
    this.awsCognito = awsCognito;
  }

  auth(username, password, userPoolId, clientId) {
    const authenticationDetails = getAuthenticationDetails(username, password,
      this.awsCognito.AuthenticationDetails);
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails,
        getGenericPromiseCallbackObject(resolve, reject));
    });
  }

  create(username, password, userPoolId, clientId, attributes) {
    const userPool = getUserPool(userPoolId, clientId, this.awsCognito.CognitoUserPool);
    const cognitoUserAttributes = getCognitoUserAttributes(attributes,
      this.awsCognito.CognitoUserAttribute);

    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, cognitoUserAttributes, null,
        getGenericPromiseCallback(resolve, reject));
    });
  }

  confirmRegistration(username, confirmationCode, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true,
        getGenericPromiseCallback(resolve, reject));
    });
  }

  resendConfirmationCode(username, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode(getGenericPromiseCallback(resolve, reject));
    });
  }

  getAttributes(username, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.getAttributes(getGenericPromiseCallback(resolve, reject));
    });
  }

  deleteAttributes(username, attributeNames, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.deleteAttributes(attributeNames, getGenericPromiseCallback(resolve, reject));
    });
  }

  updateAttributes(username, attributes, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);
    const cognitoUserAttributes = getCognitoUserAttributes(attributes,
      this.awsCognito.CognitoUserAttribute);

    return new Promise((resolve, reject) => {
      cognitoUser.updateAttributes(cognitoUserAttributes,
        getGenericPromiseCallback(resolve, reject));
    });
  }

  changePassword(username, oldPassword, newPassword, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.changePassword(oldPassword, newPassword,
        getGenericPromiseCallback(resolve, reject));
    });
  }

  forgotPassword(username, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword(getGenericPromiseCallbackObject(resolve, reject));
    });
  }

  remove(username, userPoolId, clientId) {
    const cognitoUser = getCognitoUser(username, userPoolId, clientId,
      this.awsCognito.CognitoUserPool, this.awsCognito.CognitoUser);

    return new Promise((resolve, reject) => {
      cognitoUser.deleteUser(getGenericPromiseCallback(resolve, reject));
    });
  }
};

export default userService;
