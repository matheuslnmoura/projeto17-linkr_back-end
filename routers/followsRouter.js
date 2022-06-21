/* eslint-disable import/extensions */
import { Router } from 'express';
import { insertFollow } from '../controllers/followController.js';
import verifyToken from '../middlewares/verifyToken.js';
import schemaValidation from '../middlewares/schemaValidation.js';
import followSchema from '../schemas/follow.schema.js';

const followsRouter = Router();

followsRouter.post('/follows', verifyToken, schemaValidation(followSchema), insertFollow);

export default followsRouter;
