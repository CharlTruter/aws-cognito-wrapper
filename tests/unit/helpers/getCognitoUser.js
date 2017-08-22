import sinon from 'sinon';
import getCognitoUser from '../../../src/helpers/getCognitoUser';
import * as getUserPool from '../../../src/helpers/getUserPool';
import * as fakeClass from '../../fakeClass';

describe('GetCognitoUser', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  after(() => {
    sandbox.restore();
  });

  it('Creates CognitoUser object with the right parameters', () => {
    const userPool = 'foobar';
    const cognitoUserPool = 'someCognitoUserPool';
    const spy = sandbox.stub(fakeClass, 'default');
    const stub = sandbox.stub(getUserPool, 'default').returns(userPool);

    const username = 'foobar';
    const userPoolId = 'someUserPoolId';
    const clientId = 'someClientId';

    const userData = {
      Username: username,
      Pool: userPool,
    };

    getCognitoUser(username, userPoolId, clientId, cognitoUserPool, fakeClass.default);

    sandbox.assert.calledWith(stub, userPoolId, clientId, cognitoUserPool);
    sandbox.assert.calledWith(spy, userData);
  });
});
