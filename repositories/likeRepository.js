/* eslint-disable import/extensions */
import sqlString from 'sqlstring';

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

export async function getAllLikes(userId) {
  const likes = await connection.query(`SELECT likes.post_id, users.user_name, users.id FROM likes
                           join users on likes.user_id = users.id
                           WHERE likes.user_id != ${sqlString.escape(userId)}
                           order by post_id desc`);
  return likes;
}

export async function getLikes(postId) {
  const likesFromPost = await connection.query(`SELECT likes.user_id, users.user_name FROM likes
                                                JOIN users ON users.id = likes.user_id
                                                WHERE likes.post_id = $1
                                                ORDER BY RANDOM()`, [postId]);

  return likesFromPost;
}
