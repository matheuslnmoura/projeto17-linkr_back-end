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

export function createTooltipText(userId, likesArray) {
  let likeString;
  const hasLiked = likesArray.findIndex((element) => element.id === userId);

  // User has liked
  if (hasLiked >= 0) {
    likesArray.splice(hasLiked, 1);
    if (likesArray.length >= 1) {
      likeString = `You, ${likesArray[0].user_name} and other ${likesArray.length - 1}`;
    } else { likeString = 'You Liked'; }
  } else /* User has not liked */ if (likesArray.length > 1) {
    likeString = `${likesArray[0].user_name}, ${likesArray[1].user_name} and other ${likesArray.length - 2}`;
  } else if (likesArray.length === 1) {
    likeString = `${likesArray[0].user_name} Liked`;
  } else if (likesArray.length === 0) { likeString = 'There is no likes'; }

  return likeString;
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
