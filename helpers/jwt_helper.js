const jwt = require('jsonwebtoken');
const createError = require('http-errors');

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

  verifyAccessToken: async (req, res, next) => {
    try {
      if (!req.headers.authorizarion) return next(createError.unauthorized());
      const authHeader = req.headers.authorizarion;
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];

      const payload = await jwt.verify(token, process.env.ACCESSTOKEN);
      req.payload = payload;
      next();
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JasonWebTokenError'
      )
        error.status = 401;
      next(error);
    }
  },
};
