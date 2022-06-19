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
      INSERT INTO posts (user_id, url, description, title_url, description_url, image_url) VALUES ($1, $2, $3, $4, $5, $6);`,
    [userId, url, description, titleUrl, descriptionUrl, imageUrl],
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

const postsRepository = {
  insertPost, getPosts,
};

export default postsRepository;