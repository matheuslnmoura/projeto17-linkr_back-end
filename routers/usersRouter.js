/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import getUserId from '../controllers/userIdController.js';
import { getUserPageById } from '../controllers/userPageController.js';
import { getUsers } from '../controllers/usersController.js';

const userRouter = Router();
userRouter.get('/users/', getUsers);
userRouter.get('/users/:id', getUserPageById);
userRouter.get('/user/:id', getUserId);

export default userRouter;
