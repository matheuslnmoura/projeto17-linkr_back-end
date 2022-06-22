/* eslint-disable import/extensions */
import { Router } from 'express';
import { insertFollow } from '../controllers/followController.js';
import verifyToken from '../middlewares/verifyToken.js';

const followsRouter = Router();

followsRouter.post('/follows', verifyToken, insertFollow);

export default followsRouter;
