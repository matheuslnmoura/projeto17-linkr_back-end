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
    'INSERT INTO users (email, password, user_name, url) VALUES ($1,$2,$3,$4);',
    [email, password, userName, imageUrl],
  );
}

async function getUserById(id, userId) {
  return connection.query('SELECT users.*, (SELECT COUNT(*) FROM follows WHERE following = $1 AND follower=$2) AS is_following FROM users WHERE id = $3', [id, userId, id]);
}

async function getUserFollowers(id) {
  const { rows, rowsCount } = await connection.query('SELECT following FROM follows WHERE follower=$1', [id]);

  if (rowsCount === 0) return [];

  const followers = rows.map((row) => row.following);
  return followers;
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
  const textLowerCase = `${text}%`;
  try {
    const result = await connection.query(`
    SELECT DISTINCT ON (user_name) user_name, url, id,user_followed FROM
    (SELECT users.id, users.user_name, users.url, true AS user_followed
    FROM users 
    JOIN follows 
    ON users.id = follows.following 
    WHERE users.user_name 
    LIKE $1 
    UNION ALL
    SELECT users.id,users.user_name, users.url, null AS user_followed
    FROM users
    WHERE users.user_name
    LIKE $1) dum;
    `, [textLowerCase]);

    const search = result.rows;
    if (!search[0]) {
      return [{ message: 'No results...' }];
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
  getUserFollowers,
};

export default usersRepository;
