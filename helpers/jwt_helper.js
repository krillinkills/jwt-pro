const jwt = require('jsonwebtoken');

module.exports = {
  signInAccessToken: async (userId) => {
    try {
      const payload = { id: String(userId), iss: 'ypurdomain.com' }; //giving id and issuer in jwt object
      const secret = process.env.ACCESSTOKEN;
      const options = { expiresIn: '1h' }; //expiration time

      //create a jwt token
      const token = await jwt.sign(payload, secret, options);
      return { token };
    } catch (err) {
      return { err };
    }
  },
};
