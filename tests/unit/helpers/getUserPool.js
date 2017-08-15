import sinon from 'sinon';
import getUserPool from '../../../src/helpers/getUserPool';
import * as fakeClass from '../../fakeClass';

describe('GetUserPool', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  after(() => {
    sandbox.restore();
  });

  it('Creates CognitoUserPool object with the right parameters', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const userPoolId = 'someUserPoolId';
    const clientId = 'someClientId';

    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId,
    };

    getUserPool(userPoolId, clientId, fakeClass.default);

    sandbox.assert.calledWith(spy, poolData);
  });
});
