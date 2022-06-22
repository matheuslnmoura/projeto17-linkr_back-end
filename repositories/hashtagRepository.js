/* eslint-disable import/extensions */
import connection from '../db.js';

async function getHashtagByName(hashtag) {
  return connection.query(
    `
    SELECT users.user_name, users.url AS icon,posts.id as post_id, posts.description, posts.url, posts.title_url, posts.description_url, posts.image_url
    FROM posts
    JOIN users ON posts.user_id = users.id
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

async function getHashtagIdByName(hashtag) {
  return connection.query(
    `
    SELECT hashtags.id
    FROM hashtags
    WHERE hashtags.name ILIKE $1
  `,
    [hashtag],
  );
}

const hashtagRepository = {
  getHashtagByName,
  getMostUsedHashtags,
  insertHashtag,
  getHashtagIdByName,
};

export default hashtagRepository;
