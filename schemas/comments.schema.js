import joi from 'joi';

const commentSchema = joi.object({
  userId: joi.number().integer().required(),
  postId: joi.number().integer().required(),
  comment: joi.string().required(),
});

export default commentSchema;
