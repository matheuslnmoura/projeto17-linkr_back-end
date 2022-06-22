// eslint-disable-next-line import/extensions
import usersRepository from '../repositories/userRepository.js';

export default async function getUserId(req, res) {
  const { id } = req.params;
  try {
    const result = (await usersRepository.getUserById(id)).rows;
    return res.send(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.sendStatus(500); // server error
  }
}
