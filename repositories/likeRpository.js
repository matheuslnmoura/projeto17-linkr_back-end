// eslint-disable-next-line import/extensions
import connection from '../db.js';

export async function getLike(userId, postId) {
  const like = await connection.query(`SELECT * from likes
                                        WHERE user_id = $1 and post_id = $2`, [userId, postId]);

  return like;
}

export async function addLike(userId, postId) {
  await connection.query(`INSERT INTO likes (user_id, post_id)
                            VALUES ($1, $2)`, [userId, postId]);
}

export async function removeLike(userId, postId) {
  await connection.query(`DELETE FROM likes 
                          WHERE user_id = $1 AND post_id = $2`, [userId, postId]);
}