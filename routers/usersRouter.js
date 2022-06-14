/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { getUsers } from '../controllers/usersController.js';

const userRouter = Router();
userRouter.get('/users/', getUsers);

export default userRouter;
