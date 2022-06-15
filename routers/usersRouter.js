/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { getUserPageById } from '../controllers/userPageController.js';
import { getUsers } from '../controllers/usersController.js';

const userRouter = Router();
userRouter.get('/users/', getUsers);
userRouter.get('/users/:id', getUserPageById);

export default userRouter;
