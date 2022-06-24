/* eslint-disable import/extensions */
import connection from '../db.js';

async function getPostComments(postId) {
  return connection.query(
    `
    SELECT comments.post_id, users.user_name, users.id, users.url AS profile_picture, comments.comment
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at 
  `,
    [postId],
  );
}

async function insertComment(userId, postId, comment) {
  return connection.query(`
    INSERT INTO comments (user_id, post_id, comment)
    VALUES($1, $2, $3)
  `, [userId, postId, comment]);
}

const commentRepository = {
  getPostComments,
  insertComment,
};

export default commentRepository;
