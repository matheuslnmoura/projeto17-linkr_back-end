// eslint-disable-next-line import/extensions
import connection from '../db.js';

export async function insertFollow(userId, following) {
  return connection.query(
    `
    INSERT INTO follows (follower, following) VALUES ($1, $2);`,
    [userId, following],
  );
}

export async function removeFollow(userId, following) {
  return connection.query(`
  DELETE FROM follows WHERE "follower" = $1 AND "following" = $2; `, [userId, following]);
}

export async function checkUserIsFollowing(userId, following) {
  const { rowsCount } = connection.query('SELECT * follows WHERE follower = $1 AND following = $2', [userId, following]);
  return !!rowsCount;
}

export async function searchFollow(userId) {
  return connection.query(`
  SELECT * FROM follows WHERE "follower" = $1`, [userId]);
}

const followRepository = {
  insertFollow,
  removeFollow,
  checkUserIsFollowing,
  searchFollow,
};

export default followRepository;
