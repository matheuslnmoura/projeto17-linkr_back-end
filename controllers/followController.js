/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
import followRepository from '../repositories/followRepository.js';

export async function insertFollow(req, res) {
  const { following } = req.body;
  const userId = res.locals.user.id;
  try {
    await followRepository.insertFollow(userId, following);
    res.status(200);
  } catch (e) {
    console.log('erro ao seguir', e);
    res.status(500).send(e);
  }
}
