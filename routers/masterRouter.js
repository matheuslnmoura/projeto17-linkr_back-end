/* eslint-disable import/extensions */
import { Router } from 'express';

import userRouter from './usersRouter.js';
import authRouter from './authRouter.js';

const router = Router();

router.use(userRouter);
router.use(authRouter);

export default router;
