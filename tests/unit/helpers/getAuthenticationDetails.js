import sinon from 'sinon';
import getAuthenticationDetails from '../../../src/helpers/getAuthenticationDetails';
import * as fakeClass from '../../fakeClass';

describe('GetAuthenticationDetails', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  after(() => {
    sandbox.restore();
  });

  it('Creates AuthenticationDetails object with the right parameters', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const username = 'foobar';
    const password = 'barfoo';

    const authDetails = {
      Username: username,
      Password: password,
    };

    getAuthenticationDetails(username, password, fakeClass.default);

    sandbox.assert.calledWith(spy, authDetails);
  });
});
