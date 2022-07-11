const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/User');

router.post('/register', async (req, res, next) => {
  try {
    //check if email and pass present
    const { email, body } = req.body;
    if (!email || !password) throw createError.BadRequest();

    //check if user registered
    const userExists = await User.findOne({ email: email });
    if (userExists)
      throw createError.Conflict(`${email}email already registered`);

    //Savig in DB
    const user = new User({ email: email, password: password });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch {
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
