/* eslint-disable import/extensions */
import {
  addLike, getLike, removeLike, getLikes,
} from '../repositories/likeRepository.js';

export async function likePost(req, res) {
  try {
    const { postId } = req.body.data;
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

export function createTooltipText(postLikes) {
  let userLikedString = '';
  let userHasNotLikedString = '';

  if (!postLikes) {
    userLikedString = 'You liked ';
    userHasNotLikedString = 'There are no likes';
  }

  if (postLikes.length === 1) {
    userLikedString = `You and ${postLikes[0].user_name} have liked`;
    userHasNotLikedString = `${postLikes[0].user_name} has liked`;
  }

  if (postLikes.length > 1) {
    userLikedString = `You, ${postLikes[0].user_name} ${postLikes.length - 1 > 0 ? `and others ${postLikes.length - 1} ` : ''}have liked`;
    userHasNotLikedString = `${postLikes[0].user_name} and ${postLikes[1].user_name} ${postLikes.length - 1 > 0 ? `and others ${postLikes.length - 1} ` : ''}have liked`;
  }

  return [userLikedString, userHasNotLikedString];
}

export async function allLikesfromPost(req, res) {
  try {
    const { postId } = req.body;
    const { user } = res.locals;

    const likesFromPost = await getLikes(postId);
    if (!likesFromPost.rowCount) {
      return res.status(200).json({ count: likesFromPost.rowCount, tooltipText: 'This post has no likes' });
    }

    const likeString = createTooltipText(user.id, likesFromPost.rows);

    return res.status(200).json({ count: likesFromPost.rowCount, tooltipText: likeString });
  } catch (err) {
    return res.sendStatus(500);
  }
}
