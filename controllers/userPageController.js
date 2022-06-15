/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import usersRepository from '../repositories/userRepository';

export async function getUserPageById(req, res) {
  const { id } = req.params;
  try {
    const result = (await usersRepository.getUserPageById(id));
    const user = result.rows;

    return res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
