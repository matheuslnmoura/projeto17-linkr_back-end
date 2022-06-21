// eslint-disable-next-line import/extensions
import connection from '../db.js';

export async function insertFollow(follower, following) {
  return connection.query(
    `
    INSERT INTO follows (follower, following) VALUES ($1, $2);`,
    [follower, following],
  );
}

const followRepository = {
  insertFollow,
};

export default followRepository;
