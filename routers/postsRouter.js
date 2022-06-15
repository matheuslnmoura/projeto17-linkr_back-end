/* eslint-disable import/extensions */
/* eslint-disable eol-last */
import { Router } from 'express';
import schemaValidation from '../middlewares/schemaValidation.js';
import { publishPost } from '../controllers/postsController.js';
import verifyToken from '../middlewares/verifyToken.js';
import postsSchema from '../schemas/posts.schema.js';

const postsRouter = Router();

postsRouter.post('/timeline', schemaValidation(postsSchema), verifyToken, publishPost);

export default postsRouter;