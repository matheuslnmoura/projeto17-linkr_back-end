/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { addRepost } from '../repositories/repostsRepository.js';

export async function sharePost(req, res) {
  try {
    const { postId } = req.body;
    const { user } = res.locals;
    await addRepost(postId, user.id);
    res.status(201).json({ message: 'Post Shared', status: 201 });
  } catch (e) {
    res.status(500).json({ message: 'Erro ao compartilhar post', error: e });
  }
}
