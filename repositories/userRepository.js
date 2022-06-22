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
  return connection.query(
    ` WITH inserted_id AS (
      INSERT INTO users (email, password, user_name, url) 
      VALUES ($1,$2,$3,$4)
      RETURNING id)
      INSERT INTO follows (follower,following)
      VALUES ((select id  from inserted_id),(select id from inserted_id));`,
    [email, password, userName, imageUrl],
  );
}

async function getUserById(id) {
  return connection.query('SELECT * FROM users WHERE id = $1', [id]);
}

async function getUserPageById(id) {
  return connection.query(`
  SELECT p.id,u.user_name,
  p.url,p.description,
  COUNT(l.*) as likes,
  image_url,
  description_url,
  title_url,
  p.created_at
  FROM posts p JOIN users u ON u.id = p.user_id
  LEFT JOIN likes l ON p.id = l.post_id 
  LEFT JOIN users u2 ON l.user_id = u2.id 
  WHERE p.user_id = $1 
  GROUP BY p.id,u.user_name;
`, [id]);
}

async function getUserByInput(text) {
  const textLowerCase = `${text.toLowerCase()}%`;
  try {
    const result = await connection.query(`
    SELECT users.id,users.url,
    users.user_name FROM users 
    WHERE users.user_name LIKE $1;
    `, [textLowerCase]);
    const search = result.rows;
    if (!search[0]) {
      return ['not found'];
    }
    return search;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

const usersRepository = {
  getAllUsers,
  getUserByEmail,
  createUser,
  getUserPageById,
  getUserById,
  getUserByInput,
};

export default usersRepository;
