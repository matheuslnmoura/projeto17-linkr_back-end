/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { signup } from '../controllers/authController.js';

const authRouter = Router();
authRouter.post('/signup', signup);

export default authRouter;
