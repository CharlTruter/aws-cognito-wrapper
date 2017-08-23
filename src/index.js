import * as awsCognito from 'amazon-cognito-identity-js';
import UserService from './userService';

module.exports = {
  UserService: new UserService(awsCognito),
};
