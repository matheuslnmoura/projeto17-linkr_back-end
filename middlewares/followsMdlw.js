// eslint-disable-next-line import/extensions
import { searchFollow } from '../repositories/followRepository.js';

// eslint-disable-next-line consistent-return
export default async function followsMdw(req, res, next) {
  const userId = res.locals.user.id;
  try {
    const follows = await searchFollow(userId);
    if (follows.rowCount === 0) {
      const msg = {
        message: 'You don\'t follow anyone yet. Search for new friends!',
      };
      return res.send(msg);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('erro follow middleware', e);
    return res.sendStatus(500);
  }
  next();
}
