/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { signup, signin, tokenTest } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';

const authRouter = Router();
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/test', verifyToken, tokenTest);

export default authRouter;
