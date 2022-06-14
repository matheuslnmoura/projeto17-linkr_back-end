/* eslint-disable import/extensions */
import connection from '../db.js';

async function getAllUsers() {
  return connection.query('SELECT * FROM users');
}

const usersRepository = {
  getAllUsers,
};

export default usersRepository;
