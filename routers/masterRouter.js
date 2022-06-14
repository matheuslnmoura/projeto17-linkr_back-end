/* eslint-disable import/extensions */
import { Router } from 'express';

import userRouter from './usersRouter.js';

const router = Router();

router.use(userRouter);

export default router;
