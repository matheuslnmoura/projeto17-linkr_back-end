/* eslint-disable import/extensions */
import { Router } from 'express';
import { insertFollow, removeFollow, getFollowers } from '../controllers/followController.js';
import verifyToken from '../middlewares/verifyToken.js';

const followsRouter = Router();

followsRouter.get('/follows', verifyToken, getFollowers);
followsRouter.post('/follows', verifyToken, insertFollow);
followsRouter.patch('/follows', verifyToken, removeFollow);

export default followsRouter;
