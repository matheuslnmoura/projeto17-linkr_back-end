/* eslint-disable import/extensions */
/* eslint-disable eol-last */
import { Router } from 'express';
import schemaValidation from '../middlewares/schemaValidation.js';
import {
  publishPost,
  getPosts,
  editPost,
  deletePost,
} from '../controllers/postsController.js';
import verifyToken from '../middlewares/verifyToken.js';
import postsSchema from '../schemas/posts.schema.js';
import editPostSchema from '../schemas/edit.schema.js';
import searchFollowMdw from '../middlewares/verifyFollows.js';

const postsRouter = Router();

postsRouter.post(
  '/timeline',
  schemaValidation(postsSchema),
  verifyToken,
  publishPost,
);
postsRouter.get('/timeline', verifyToken, searchFollowMdw, getPosts);
postsRouter.patch(
  '/timeline/:postId',
  verifyToken,
  schemaValidation(editPostSchema),
  editPost,
);
postsRouter.delete('/timeline/:postId', verifyToken, deletePost);

export default postsRouter;
