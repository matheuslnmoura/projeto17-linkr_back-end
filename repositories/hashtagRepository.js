/* eslint-disable import/extensions */
import connection from '../db.js';

async function getHashtagByName(hashtag) {
  return connection.query(`
    SELECT posts.*
    FROM posts
    JOIN post_hashtags ON post_hashtags.post_id = posts.id
    JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
    WHERE hashtags.name ILIKE $1
    AND posts.is_deleted = false
  `, [hashtag]);
}

const hashtagRepository = {
  getHashtagByName,
};

export default hashtagRepository;
