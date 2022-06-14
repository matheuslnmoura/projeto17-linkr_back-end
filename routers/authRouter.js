/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import { signup, signin, tokenTest } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import schemaValidation from '../middlewares/schemaValidation.js';
import signinSchema from '../schemas/signin.schema.js';
import signupSchema from '../schemas/signup.schema.js';

const authRouter = Router();
authRouter.post('/signup', schemaValidation(signupSchema), signup);
authRouter.post('/signin', schemaValidation(signinSchema), signin);
authRouter.get('/test', verifyToken, tokenTest);

export default authRouter;
