import joi from 'joi';

const editPostSchema = joi.object({
  description: joi.string().allow('').optional(),
});

export default editPostSchema;
