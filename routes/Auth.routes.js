const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.send('register');
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
