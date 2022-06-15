/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import usersRepository from '../repositories/userRepository.js';

export async function getUsers(req, res) {
  try {
    const result = (await usersRepository.getAllUsers()).rows;
    return res.send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }
}
