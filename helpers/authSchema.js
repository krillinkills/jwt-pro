const Joi = require('joi');

exports.authSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().pattern(new RegExp('^]a-zA-Z=-9]{8,30}$')).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});
