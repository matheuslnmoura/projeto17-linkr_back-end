/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { signup, signin } from '../controllers/authController.js';

const authRouter = Router();
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);

export default authRouter;
