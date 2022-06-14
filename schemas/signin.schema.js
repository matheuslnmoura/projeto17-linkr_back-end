import joi from 'joi';

const signinSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export default signinSchema;
