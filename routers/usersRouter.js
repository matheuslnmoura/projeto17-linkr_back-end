/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { getUserId, getUsers } from '../controllers/usersController.js';

const userRouter = Router();
userRouter.get('/users/', getUsers);
userRouter.get('/users/:id', getUserId);

export default userRouter;
