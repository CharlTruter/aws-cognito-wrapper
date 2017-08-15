import * as awsCognito from 'amazon-cognito-identity-js';
import UserService from './userService';

export default {
  UserService: new UserService(awsCognito),
};
