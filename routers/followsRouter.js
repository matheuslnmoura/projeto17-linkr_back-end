/* eslint-disable import/extensions */
import { Router } from 'express';
import { insertFollow, removeFollow, getFollowers } from '../controllers/followController.js';
import verifyToken from '../middlewares/verifyToken.js';

const followsRouter = Router();

followsRouter.post('/follows/:id', verifyToken, insertFollow);
followsRouter.delete('/follows/:id', verifyToken, removeFollow);
followsRouter.get('/follows', verifyToken, getFollowers);

export default followsRouter;
