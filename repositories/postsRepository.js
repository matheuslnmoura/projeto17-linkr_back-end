/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
/* eslint-disable import/extensions */
import connection from '../db.js';

export async function insertPost(post) {
  const {
    userId, url, description, titleUrl, descriptionUrl, imageUrl,
  } = post;
  return connection.query(
    `
      INSERT INTO posts (user_id, url, description, title_url, description_url, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [userId, url, description, titleUrl, descriptionUrl, imageUrl],
  );
}

async function editPost({ postId, description }) {
  return connection.query(
    `
      UPDATE posts SET description = $2 WHERE id = $1 RETURNING *;
    `,
    [postId, description],
  );
}

export async function getPosts() {
  return connection.query(`SELECT p.id AS post_id, u.user_name, u.url AS icon, p.description, p.url, p.title_url, p.description_url, p.image_url, count(l.post_id) AS like_Count FROM posts p
  LEFT JOIN likes l ON  p.id = l.post_id
  JOIN users u ON p.user_id = u.id
  GROUP BY p.id, u.user_name, u.url, p.description , p.url, p.title_url, p.description_url, p.image_url
  ORDER BY p.created_at DESC
  LIMIT 20;`);
}

async function getPostById(postId) {
  return connection.query(
    `
    SELECT * FROM posts WHERE id = $1;
    `,
    [postId],
  );
}

async function insertPostHashtagRelation(postId, hashtagId) {
  return connection.query(
    `
      INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2);`,
    [postId, hashtagId],
  );
}

async function deletePostHashtagRelation(postId) {
  return connection.query(
    `
      DELETE FROM post_hashtags WHERE post_id = $1;`,
    [postId],
  );
}

const postsRepository = {
  insertPost,
  editPost,
  getPosts,
  insertPostHashtagRelation,
  deletePostHashtagRelation,
  getPostById,
};

export default postsRepository;