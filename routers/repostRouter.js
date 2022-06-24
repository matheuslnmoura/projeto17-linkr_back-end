/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';

import verifyToken from '../middlewares/verifyToken.js';
import { sharePost } from '../controllers/repostController.js';

const repostRouter = Router();

repostRouter.post('/repost', verifyToken, sharePost);

export default repostRouter;
