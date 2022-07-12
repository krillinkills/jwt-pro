const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/User');
const authSchema = require('../helpers/authSchema');

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
    res.status(201).send(savedUser);
  } catch {
    if (error.usjoi === true) error.status = 422;
    next(error);
  }
});

router.post('/login', (req, res) => {
  res.send('login');
});

router.post('/refresh', (req, res) => {
  res.send('refresh Token');
});

router.delete('/delete', (req, res) => {
  res.send('deleteToken');
});

module.exports = router;
