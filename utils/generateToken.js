const jwt = require('jsonwebtoken');

const secret = 'wowsuchasafesecret';

module.exports = (userInfo) => {
  const token = jwt.sign({ ...userInfo }, secret, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
};
