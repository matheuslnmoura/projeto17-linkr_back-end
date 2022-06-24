/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import followRepository from '../repositories/followRepository.js';

export async function insertFollow(req, res) {
  const { id } = req.params;
  const userId = res.locals.user.id;
  try {
    const idParsed = Number(id);
    const userIsFollowing = await followRepository.checkUserIsFollowing(userId, idParsed);

    if (userIsFollowing) {
      res.status(400).send('Você já segue o usuário');
      return;
    }

    await followRepository.insertFollow(userId, id);
    res.sendStatus(200);
  } catch (e) {
    console.log('erro ao seguir', e);
    res.status(500).send(e);
  }
}

export async function removeFollow(req, res) {
  const { id } = req.params;
  const userId = res.locals.user.id;
  try {
    const idParsed = Number(id);
    const userIsFollowing = await followRepository.checkUserIsFollowing(userId, idParsed);

    if (!userIsFollowing) {
      res.status(400).send('Você ainda não segue o usuário');
      return;
    }

    await followRepository.removeFollow(userId, id);
    res.sendStatus(200);
  } catch (e) {
    console.log('erro ao dar unfollow', e);
    res.status(500).send(e);
  }
}
