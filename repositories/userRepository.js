/* eslint-disable import/extensions */
import connection from '../db.js';

async function getAllUsers() {
  return connection.query('SELECT * FROM users');
}

async function getUserByEmail(email) {
  return connection.query('SELECT * FROM users WHERE email = $1', [email]);
}

async function createUser({
  email, password, userName, imageUrl,
}) {
  return connection.query('INSERT INTO users (email, password, user_name, url) VALUES ($1, $2, $3, $4)', [
    email,
    password,
    userName,
    imageUrl,
  ]);
}

async function getUserById(id) {
  return connection.query('SELECT * FROM users WHERE id = $1', [id]);
}

const usersRepository = {
  getAllUsers,
  getUserByEmail,
  createUser,
  getUserById,
};

export default usersRepository;
