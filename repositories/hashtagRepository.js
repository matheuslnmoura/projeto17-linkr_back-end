/* eslint-disable import/extensions */
import connection from '../db.js';

async function getHashtagByName(hashtag) {
  return connection.query(
    `
    SELECT posts.*
    FROM posts
    JOIN post_hashtags ON post_hashtags.post_id = posts.id
    JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
    WHERE hashtags.name ILIKE $1
    AND posts.is_deleted = false
  `,
    [hashtag],
  );
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

async function insertHashtag(hashtag) {
  return connection.query(
    `
    INSERT INTO hashtags (name) VALUES ($1) RETURNING *;
  `,
    [hashtag],
  );
}

const hashtagRepository = {
  getHashtagByName,
  getMostUsedHashtags,
  insertHashtag,
};

export default hashtagRepository;
