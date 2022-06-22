/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { getPosts } from '../controllers/postsController.js';
import getUserId from '../controllers/userIdController.js';
import { getUsers } from '../controllers/usersController.js';
import verifyToken from '../middlewares/verifyToken.js';

const userRouter = Router();
userRouter.get('/users/', getUsers);
userRouter.get('/users/:id', verifyToken, getPosts);
userRouter.get('/user/:id', getUserId);

export default userRouter;
