import joi from 'joi';

const postsSchema = joi.object({
  url: joi.string().uri().required(),
  description: joi.string().optional(),
});

export default postsSchema;
