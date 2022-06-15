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

async function getMostUsedHashtags() {
  return connection.query(`
    SELECT hashtags.name, COUNT(post_hashtags.hashtag_id) AS number_of_posts
    FROM post_hashtags
    JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
    GROUP BY post_hashtags.hashtag_id, hashtags.name
    ORDER BY number_of_posts DESC
  `);
}

const hashtagRepository = {
  getHashtagByName,
  getMostUsedHashtags,
};

export default hashtagRepository;
