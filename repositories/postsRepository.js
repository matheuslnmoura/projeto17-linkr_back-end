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
  return connection.query(`SELECT users.user_name, users.url AS icon, posts.description, posts.url, posts.title_url, posts.description_url, posts.image_url
  FROM posts 
  JOIN users ON posts.user_id = users.id
  ORDER BY posts.created_at DESC
  LIMIT 20;`);
}

const postsRepository = {
  insertPost, getPosts,
};

export default postsRepository;
