# Amazon Cognito Identity SDK for JavaScript Wrapper

Build status:
![N|Solid](https://travis-ci.org/CharlTruter/aws-cognito-wrapper.svg?branch=master)

Interacting with the existing [Amazon Cognito Identity SDK for JavaScript](https://github.com/aws/amazon-cognito-identity-js) proved a little painful - you had to do a lot of plumbing to do to perform simple tasks, which normally meant you had to wrap the SDK code in a repository of some sort to simplify things. (Not to mention that if you use automated tests at all, you'd need to write tests for all of this code).

In order to make things easier on myself (and others) - I've wrapped the logic most often used in the SDK, which now only requires you to include the wrapper which will perform all the plumbing for you, only requiring you to send through a few parameters for each method.

Right now, not all methods are wrapped, but feel free to submit a pull request for any new wrapped methods.

### User attributes
User attributes can be passed to the methods in the following format:
```
[
    {
        name: 'Some Attribute Name',
        value: 'Some Attribute Value
    },
    {
        name: 'Another Attribute Name',
        value: 'Another Attribute Value
    }
}
```

### User functions
#### Authenticate a user
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.auth(username, password, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Create a user
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.create(username, password, userPoolId, clientId, attributes)
    .then(// Handle result here)
    .catch(// Handle exception here);
```
See the *User attributes* section for the expected format of the attributes parameter.

#### Confirm user registration
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.confirmRegistration(username, confirmationCode, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Resend user confirmation code
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.resendConfirmationCode(username, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Get user attributes
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.getAttributes(username, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Delete user attributes
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.deleteAttributes(username, attributeNames, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```
The attributeNames parameter is simply an array of the attribute names.

#### Update user attributes
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.updateAttributes(username, attributes, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```
See the *User attributes* section for the expected format of the attributes parameter.

#### Change user password
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.changePassword(username, oldPassword, newPassword, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Send forgot password notification
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.forgotPassword(username, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```

#### Remove a user
```
const wrapper = require('aws-cognito-wrapper');
wrapper.UserService.remove(username, userPoolId, clientId)
    .then(// Handle result here)
    .catch(// Handle exception here);
```
