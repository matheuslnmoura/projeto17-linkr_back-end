/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getHashtag, getTrendingHashtags } from '../controllers/hashtagController.js';

const hashtagRouter = Router();

hashtagRouter.get('/hashtags', verifyToken, getTrendingHashtags);
hashtagRouter.get('/hashtag/:hashtag', verifyToken, getHashtag);

export default hashtagRouter;
