const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../helpers/init_redis');

module.exports = {
  signInAccessToken: async (userId) => {
    try {
      const payload = { id: String(userId), iss: 'yourdomain.com' }; //giving id and issuer in jwt object
      const secret = process.env.ACCESSTOKEN;
      const options = { expiresIn: '1h' }; //expiration time

      //create a jwt token
      const accesstoken = await jwt.sign(payload, secret, options);
      return { accesstoken };
    } catch (accesserror) {
      return { accesserror };
    }
  },

  signInRefreshToken: async (userId) => {
    try {
      const payload = {};
      const secret = process.env.REFRESHTOKEN;
      const options = {
        expiresIn: '1y',
        iss: 'yourdomain@domain.com',
        audience: String(userId),
      };
      const refreshtoken = await jwt.sign(payload, secret, options);
      await client.SET(String(userId), refreshtoken, 'EX', 365 * 24 * 60 * 60);
      return { refreshtoken };
    } catch (refresherror) {
      return { refresherror };
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
  verifyRefreshToken: async (refreshtoken) => {
    try {
      const payload = await jwt.verify(refreshtoken, process.env.REFRESHTOKEN);
      const userId = payload.aud;
      const res = await client.GET(userId);
      if (res === refreshtoken) throw createError.unauthorized();
      return { userId };
    } catch (error) {
      return error;
    }
  },
};
