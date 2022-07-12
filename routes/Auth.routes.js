const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/User');
const { authSchema, loginSchema } = require('../helpers/authSchema');
const { signInAccessToken } = require('../helpers/jwt_helper');

router.post('/register', async (req, res, next) => {
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
    const token = await signInAccessToken(savedUser._id);

    if (error) throw createError.NotImplemented();

    res.status(201).send(token);
  } catch (error) {
    if (error.isjoi === true) error.status = 422;
    next(error);
  }
});

//LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const results = await loginSchema.validateAsync(req.body); //validates the schema

    const user = await User.findOne({ email: results.email }); //checking if user exists
    if (!user) throw createError.NotFound('username/Password incorrect');

    //comparing pass
    const matched = await user.isValidPassword(results.password);

    if (!matched) throw createError.Unauthorized('username/Password incorrect');

    //JWT SIGNIN
    const { error, token } = await signInAccessToken(user._id);
    if (error) throw createError.InternalServerError();

    res.status(201).send({ token: token });

    res.send(user);
    //
  } catch (error) {
    if (error.isjoi === true) error.status = 422;
    next(error);
  }
});

router.post('/refresh', (req, res) => {
  res.send('refresh Token');
});

router.delete('/delete', (req, res) => {
  res.send('deleteToken');
});

module.exports = router;
