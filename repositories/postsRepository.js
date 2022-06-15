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

const postsRepository = {
  insertPost,
};

export default postsRepository;