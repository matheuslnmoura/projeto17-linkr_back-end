/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getTrendingHashtags } from '../controllers/hashtagController.js';
import { getPosts } from '../controllers/postsController.js';

const hashtagRouter = Router();

hashtagRouter.get('/hashtags', verifyToken, getTrendingHashtags);
hashtagRouter.get('/hashtag/:hashtag', verifyToken, getPosts);

export default hashtagRouter;
