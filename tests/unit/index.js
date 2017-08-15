import chai from 'chai';
import Wrapper from '../../src/index';

const assert = chai.assert;

describe('Entrypoint', () => {
  it('User property is defined', () => {
    assert.isDefined(Wrapper);
    assert.isDefined(Wrapper.UserService);
  });
});
