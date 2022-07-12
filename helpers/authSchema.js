const Joi = require('joi');

const email = Joi.string().lowercase().email().required();
const password = Joi.string()
  .pattern(new RegExp('^]a-zA-Z=-9]{8,30}$'))
  .required();

exports.authSchema = Joi.object({
  email: email,
  password: password,
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

exports.loginSchema = Joi.object({
  email: email,
  password: password,
});
