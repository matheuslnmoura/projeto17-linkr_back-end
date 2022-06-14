import joi from 'joi';

const signupSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
  userName: joi.string().required(),
  imageUrl: joi.string().uri().required(),
});

export default signupSchema;
