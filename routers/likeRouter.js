/* eslint-disable import/extensions */
import { Router } from 'express';

import verifyToken from '../middlewares/verifyToken.js';
import { likePost, unlikePost } from '../controllers/likesController.js';

const likeRouter = Router();

likeRouter.post('/like', verifyToken, likePost);
likeRouter.delete('/like', verifyToken, unlikePost);

export default likeRouter;
