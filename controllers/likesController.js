/* eslint-disable import/extensions */
import { addLike, getLike, removeLike } from '../repositories/likeRpository.js';

export async function likePost(req, res) {
  try {
    const { postId } = req.body;
    const { user } = res.locals;

    const like = await getLike(user.id, postId);

    if (like.rowCount) return res.status(409).json({ message: 'Post already liked', status: 409 });

    await addLike(user.id, postId);

    return res.status(201).json({ message: 'Post Liked', status: 201 });
  } catch (err) {
    return res.sendStatus(500);
  }
}

export async function unlikePost(req, res) {
  try {
    const { postId } = req.body;
    const { user } = res.locals;

    const like = await getLike(user.id, postId);

    if (!like.rowCount) return res.status(404).json({ message: 'Like not found ', status: 404 });

    await removeLike(user.id, postId);

    return res.status(204).json({ message: 'Like removed', status: 204 });
  } catch (err) {
    return res.sendStatus(500);
  }
}
