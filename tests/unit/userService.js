import chai from 'chai';
import sinon from 'sinon';
import UserService from '../../src/userService';
import * as getAuthenticationDetails from '../../src/helpers/getAuthenticationDetails';
import * as getCognitoUser from '../../src/helpers/getCognitoUser';
import * as getUserPool from '../../src/helpers/getUserPool';
import * as getCognitoUserAttributes from '../../src/helpers/getCognitoUserAttributes';

const assert = chai.assert;

describe('User', () => {
  let sandbox;
  let fakeCognitoUser;
  const fakeAwsCognito = {
    AuthenticationDetails: 'barfoo1',
    CognitoUserPool: 'barfoo2',
    CognitoUser: 'barfoo3',
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    fakeCognitoUser = {
      authenticateUser: sinon.stub().callsFake((authenticationDetails, callback) => {
        callback.onSuccess();
      }),
      confirmRegistration: sinon.stub().callsFake(
        (confirmationCode, forceAliasCreation, callback) => {
          callback(null, 'barfoo');
        }),
      resendConfirmationCode: sinon.stub().callsFake((callback) => {
        callback(null, 'barfoo');
      }),
      getAttributes: sinon.stub().callsFake((callback) => {
        callback(null, 'barfoo');
      }),
      deleteAttributes: sinon.stub().callsFake((attributeNames, callback) => {
        callback(null, 'barfoo');
      }),
      updateAttributes: sinon.stub().callsFake((attributes, callback) => {
        callback(null, 'barfoo');
      }),
      changePassword: sinon.stub().callsFake((oldPassword, newPassword, callback) => {
        callback(null, 'barfoo');
      }),
      forgotPassword: sinon.stub().callsFake((callback) => {
        callback.onSuccess();
      }),
      deleteUser: sinon.stub().callsFake((callback) => {
        callback(null, 'barfoo');
      }),
    };

    sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUser);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('Auth', () => {
    beforeEach(() => {
      sandbox.stub(getAuthenticationDetails, 'default').returns('foobar1');
    });

    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.auth('someUsername', 'somePassword', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const password = 'somePassword';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.auth(username, password, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getAuthenticationDetails.default, username, password,
              fakeAwsCognito.AuthenticationDetails);
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            assert.lengthOf(fakeCognitoUser.authenticateUser.args, 1);
            assert.lengthOf(fakeCognitoUser.authenticateUser.args[0], 2);
            assert.equal(fakeCognitoUser.authenticateUser.args[0][0], 'foobar1');
            assert.property(fakeCognitoUser.authenticateUser.args[0][1], 'onSuccess');
            assert.property(fakeCognitoUser.authenticateUser.args[0][1], 'onFailure');

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        authenticateUser: sinon.stub().callsFake((authenticationDetails, callback) => {
          callback.onFailure('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.auth('someUsername', 'somePassword', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('Create', () => {
    let fakeUserPool;
    beforeEach(() => {
      sandbox.stub(getCognitoUserAttributes, 'default').returns('foobar1');

      fakeUserPool = {
        signUp: sandbox.stub().callsFake(
          (username, password, cognitoUserAttributes, validationData, callback) => {
            callback(null, 'foobar2');
          }),
      };

      sandbox.stub(getUserPool, 'default').returns(fakeUserPool);
    });

    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.create('someUsername', 'somePassword', 'someUserPoolId', 'someClientId', 'someAttributes');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const password = 'somePassword';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const attributes = 'someAttributes';
      const userService = new UserService(fakeAwsCognito);

      userService.create(username, password, userPoolId, clientId, attributes)
        .then(() => {
          try {
            sandbox.assert.calledWith(getUserPool.default, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool);
            sandbox.assert.calledWith(getCognitoUserAttributes.default, attributes,
              fakeAwsCognito.CognitoUserAttribute);

            sandbox.assert.calledWith(fakeUserPool.signUp, username, password, 'foobar1', null);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getUserPool.default.restore();

      const fakeUserPoolFailure = {
        signUp: sandbox.stub().callsFake(
          (username, password, cognitoUserAttributes, validationData, callback) => {
            callback('barfoo');
          }),
      };

      sandbox.stub(getUserPool, 'default').returns(fakeUserPoolFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.create('someUsername', 'somePassword', 'someUserPoolId', 'someClientId', 'someAttributes')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('ConfirmRegistration', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.confirmRegistration('someUsername', 'someConfirmCode', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const confirmationCode = 'someConfirmCode';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.confirmRegistration(username, confirmationCode, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledWith(fakeCognitoUser.confirmRegistration, confirmationCode, true);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        confirmRegistration: sinon.stub().callsFake(
          (confirmationCode, forceAliasCreation, callback) => {
            callback('barfoo');
          }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.confirmRegistration('someUsername', 'someConfirmCode', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('ResendConfirmationCode', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.resendConfirmationCode('someUsername', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.resendConfirmationCode(username, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledOnce(fakeCognitoUser.resendConfirmationCode);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        resendConfirmationCode: sinon.stub().callsFake((callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.resendConfirmationCode('someUsername', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('GetAttributes', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.getAttributes('someUsername', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.getAttributes(username, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledOnce(fakeCognitoUser.getAttributes);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        getAttributes: sinon.stub().callsFake((callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.getAttributes('someUsername', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('DeleteAttributes', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.deleteAttributes('someUsername', 'someAttributes', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const attributeNames = 'someAttributes';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.deleteAttributes(username, attributeNames, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledWith(fakeCognitoUser.deleteAttributes, attributeNames);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        deleteAttributes: sinon.stub().callsFake((attributeNames, callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.deleteAttributes('someUsername', 'someAttributes', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('UpdateAttributes', () => {
    beforeEach(() => {
      sandbox.stub(getCognitoUserAttributes, 'default').returns('foobar1');
    });

    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.updateAttributes('someUsername', 'someAttributes', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const attributes = 'someAttributes';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.updateAttributes(username, attributes, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);
            sandbox.assert.calledWith(getCognitoUserAttributes.default, attributes,
              fakeAwsCognito.CognitoUserAttribute);

            sandbox.assert.calledWith(fakeCognitoUser.updateAttributes, 'foobar1');

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        updateAttributes: sinon.stub().callsFake((attributes, callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.updateAttributes('someUsername', 'someAttributes', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('ChangePassword', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.changePassword('someUsername', 'oldPassword', 'newPassword', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const oldPassword = 'someOldPassword';
      const newPassword = 'someNewPassword';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.changePassword(username, oldPassword, newPassword, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledWith(fakeCognitoUser.changePassword, oldPassword, newPassword);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        changePassword: sinon.stub().callsFake((oldPassword, newPassword, callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.changePassword('someUsername', 'someOldPassword', 'someNewPassword', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('ForgotPassword', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.forgotPassword('someUsername', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.forgotPassword(username, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledOnce(fakeCognitoUser.forgotPassword);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        forgotPassword: sinon.stub().callsFake((callback) => {
          callback.onFailure('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.forgotPassword('someUsername', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  describe('GetAttributes', () => {
    it('Returns a promise', () => {
      const userService = new UserService(fakeAwsCognito);

      const response = userService.remove('someUsername', 'someUserPoolId', 'someClientId');
      assert.property(response, 'then');
      assert.typeOf(response.then, 'function');
    });

    it('Calls the correct methods with the correct parameters', (done) => {
      const username = 'someUsername';
      const userPoolId = 'someUserPoolId';
      const clientId = 'someClientId';
      const userService = new UserService(fakeAwsCognito);

      userService.remove(username, userPoolId, clientId)
        .then(() => {
          try {
            sandbox.assert.calledWith(getCognitoUser.default, username, userPoolId, clientId,
              fakeAwsCognito.CognitoUserPool, fakeAwsCognito.CognitoUser);

            sandbox.assert.calledOnce(fakeCognitoUser.deleteUser);

            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(done);
    });

    it('Handles failure properly with promise', (done) => {
      getCognitoUser.default.restore();

      const fakeCognitoUserFailure = {
        deleteUser: sinon.stub().callsFake((callback) => {
          callback('barfoo');
        }),
      };

      sandbox.stub(getCognitoUser, 'default').returns(fakeCognitoUserFailure);

      const userService = new UserService(fakeAwsCognito);

      userService.remove('someUsername', 'someUserPoolId', 'someClientId')
        .then(() => done('Expected an exception'))
        .catch((error) => {
          try {
            assert.equal(error, 'barfoo');

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });
});
