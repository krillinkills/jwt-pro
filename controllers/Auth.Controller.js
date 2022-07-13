const createError = require('http-errors');
const User = require('../models/User');
const { authSchema, loginSchema } = require('../helpers/authSchema');
const {
  signInAccessToken,
  signInRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_helper');
const client = require('../helpers/init_redis');

module.exports = {
  register: async (req, res, next) => {
    try {
      //validating data
      await authSchema.validateAsync(req.body);

      //Extracting email pass
      const { email, password } = req.body;

      //check if user registered
      const userExists = await User.findOne({ email: email });
      if (userExists)
        throw createError.Conflict(`${email}email already registered`);

      //Savig in DB
      const user = new User({ email: email, password: password });
      const savedUser = await user.save();

      //jwt sign in
      const { Aerror, accesstoken } = await signInAccessToken(savedUser._id);
      const { Rerror, refreshtoken } = await signInRefreshToken(savedUser._id);

      if (Aerror || Rerror) throw createError.NotImplemented();

      res
        .status(201)
        .send({ accesstoken: accesstoken, refreshtoken: refreshtoken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const results = await loginSchema.validateAsync(req.body); //validates the schema

      const user = await User.findOne({ email: results.email }); //checking if user exists
      if (!user) throw createError.NotFound('username/Password incorrect');

      //comparing pass
      const matched = await user.isValidPassword(results.password);

      if (!matched)
        throw createError.Unauthorized('username/Password incorrect');

      //JWT SIGNIN
      const { accesserror, accesstoken } = await signInAccessToken(user._id);
      const { refresherror, refreshtoken } = await signInRefreshToken(user._id);
      if (accesserror || refresherror) throw createError.InternalServerError();

      res
        .status(200)
        .send({ accesstoken: accesstoken, refreshtoken: refreshtoken });

      res.send(user);
      //
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  refresh: async (req, res, next) => {
    try {
      //validate
      const { refresh_token } = req.body;
      if (!refreshtoken) throw createError.BadRequest('token not found');
      //verify
      const { error, userId } = await verifyRefreshToken(refresh_token);
      if (error) throw createError.BadRequest();
      //signing with userId
      const { accesserror, accesstoken } = await signInAccessToken(userId);
      const { refresherror, refreshtoken } = await signInRefreshToken(userId);
      if (accesserror || refresherror) throw createError.InternalServerError();

      return res
        .status(200)
        .send({ accesstoken: accesstoken, refreshtoken: refreshtoken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const refreshtoken = req.body;
      if (!refreshtoken) throw createError.BadRequest();

      const { error, userId } = await verifyRefreshToken(refreshtoken);
      if (error) throw createError.BadRequest();

      await client.del(userId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
