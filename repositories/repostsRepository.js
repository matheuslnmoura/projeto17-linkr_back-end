/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import sqlString from 'sqlstring';
import connection from '../db.js';

export async function addRepost(postId, userid) {
  return connection.query(`INSERT INTO reposts (post_id, user_id)
                    VALUES (${sqlString.escape(postId)}, ${sqlString.escape(userid)})`);
}
