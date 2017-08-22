import sinon from 'sinon';
import chai from 'chai';
import getCognitoUserAttributes from '../../../src/helpers/getCognitoUserAttributes';
import * as fakeClass from '../../fakeClass';

const assert = chai.assert;

describe('GetCognitoUserAttributes', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('Returns an empty array and does not call constructor when attributes are null', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const cognitoAttributes = getCognitoUserAttributes(null, fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Returns an empty array and does not call constructor when attributes are an empty array', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const cognitoAttributes = getCognitoUserAttributes([], fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Returns an empty array and does not call constructor when attribute has no name', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      value: 'someValue',
    }];

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Returns an empty array and does not call constructor when attribute has no value', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      name: 'someName',
    }];

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Returns an empty array and does not call constructor when attribute has null name', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      name: null,
      value: 'someValue',
    }];

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Returns an empty array and does not call constructor when attribute has null value', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      name: 'someName',
      value: null,
    }];

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    sandbox.assert.callCount(spy, 0);
    assert.lengthOf(cognitoAttributes, 0);
  });

  it('Calls constructor with the correct parameters and result has 1 entry for one attribute', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      name: 'someName',
      value: 'someValue',
    }];

    const cognitoUserAttributeData = {
      Name: attributes[0].name,
      Value: attributes[0].value,
    };

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    sandbox.assert.calledWith(spy, cognitoUserAttributeData);
    assert.lengthOf(cognitoAttributes, 1);
  });

  it('Calls constructor with the correct parameters and result has 2 entries for two attribute', () => {
    const spy = sandbox.spy(fakeClass, 'default');

    const attributes = [{
      name: 'someName',
      value: 'someValue',
    }, {
      name: 'anotherName',
      value: 'anotherValue',
    }];

    const firstAttrData = {
      Name: attributes[0].name,
      Value: attributes[0].value,
    };

    const secondAttrData = {
      Name: attributes[1].name,
      Value: attributes[1].value,
    };

    const cognitoAttributes = getCognitoUserAttributes(attributes, fakeClass.default);

    assert.lengthOf(cognitoAttributes, 2);
    assert.lengthOf(spy.args, 2);
    assert.lengthOf(spy.args[0], 1);
    assert.lengthOf(spy.args[1], 1);
    assert.equal(JSON.stringify(spy.args[0][0]), JSON.stringify(firstAttrData));
    assert.equal(JSON.stringify(spy.args[1][0]), JSON.stringify(secondAttrData));
  });
});
