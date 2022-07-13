const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth.Controller');

router.post('/register', authController.register);

//LOGIN
router.post('/login', authController.login);

//REFRESH ROUTE
router.post('/refresh', authController.refresh);

//logout
router.delete('/logout', authController.logout);

module.exports = router;
