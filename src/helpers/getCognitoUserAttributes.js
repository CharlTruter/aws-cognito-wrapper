export default function getCognitoUserAttributes(attributes, CognitoUserAttribute) {
  const cognitoUserAttributes = [];
  if (attributes && attributes.length > 0) {
    attributes.forEach((attribute) => {
      if (attribute.name && attribute.value) {
        const cognitoUserAttributeData = {
          Name: attribute.name,
          Value: attribute.value,
        };

        cognitoUserAttributes.push(new CognitoUserAttribute(cognitoUserAttributeData));
      }
    });
  }

  return cognitoUserAttributes;
}
