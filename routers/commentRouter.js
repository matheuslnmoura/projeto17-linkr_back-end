/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getComments, postComment } from '../controllers/commentController.js';
import schemaValidation from '../middlewares/schemaValidation.js';
import commentSchema from '../schemas/comments.schema.js';

const commentRouter = Router();

commentRouter.get('/comments/:postId', verifyToken, getComments);
commentRouter.post('/comment', verifyToken, schemaValidation(commentSchema), postComment);

export default commentRouter;
