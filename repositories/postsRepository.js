/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
/* eslint-disable import/extensions */
import sqlString from 'sqlstring';
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

async function deletePost(postId) {
  return connection.query(
    `
    UPDATE posts SET is_deleted = true WHERE id = $1 RETURNING *;`,
    [postId],
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

export async function getPosts(idParams, idToken, hashtag) {
  let postAppend = `    RIGHT JOIN follows f
                        ON p.user_id = f.following
                        WHERE   
                        p.is_deleted = false 
                        AND
                        f.follower = ${sqlString.escape(idToken)}`;
  let repostAppend = `  RIGHT JOIN follows f
                        ON r.user_id = f.following
                        WHERE 
                        p.is_deleted = false
                        AND
                        r.is_deleted = false
                        AND
                        f.follower = ${sqlString.escape(idToken)}`;
  if (idParams) {
    postAppend = `    WHERE 
                      p.is_deleted = false
                      AND 
                      p.user_id = ${sqlString.escape(idParams)}`;
    repostAppend = `WHERE 
                    p.is_deleted = false
                    AND
                    r.is_deleted = false
                    AND  
                    r.user_id = ${sqlString.escape(idParams)}`;
  }
  return connection.query(`SELECT *
        FROM (
        SELECT 
            p.id AS post_id, 
            u.user_name, 
            p.description, 
            p.url, 
            u.url AS icon,
            p.title_url, 
            p.description_url, 
            p.image_url, 
            count(l.post_id) AS like_Count,
            count(c.post_id) AS comment_Count,
            (SELECT COUNT(*) 
                FROM likes 
                JOIN posts  ON likes.post_id = posts.id
                WHERE 
                    likes.user_id = ${sqlString.escape(idToken)} -- token
                    AND likes.post_id = p.id) AS liked_by_me,
            null as user_name_repost,
            null as user_id_repost,
            p.created_at
        FROM posts p
        LEFT JOIN likes l 
            ON  p.id = l.post_id
        JOIN users u 
            ON p.user_id = u.id
        LEFT JOIN comments c
            ON c.post_id = p.id
        ${postAppend}
        GROUP BY p.id, u.user_name, u.url, p.description , p.url, p.title_url, p.description_url, p.image_url
        
        UNION ALL
        
        SELECT 
            p.id AS post_id, 
            u.user_name, 
            p.description, 
            p.url, 
            u.url AS icon,
            p.title_url, 
            p.description_url, 
            p.image_url, 
            count(l.post_id) AS like_Count,
            count(c.post_id) AS comment_Count,
            (SELECT COUNT(*) 
                FROM likes 
                JOIN posts  ON likes.post_id = posts.id
                WHERE 
                    likes.user_id = ${sqlString.escape(idToken)} -- token
                    AND likes.post_id = p.id) AS liked_by_me,

            ur.user_name as user_name_repost,
            r.user_id as user_id_repost,
            r.created_at
        FROM reposts r
        JOIN users ur
            ON ur.id = r.user_id
        JOIN posts p 
            ON p.id = r.post_id
        LEFT JOIN likes l 
            ON  p.id = l.post_id
        JOIN users u 
            ON p.user_id = u.id
        LEFT JOIN comments c
        ON c.post_id = p.id
          ${repostAppend}
        GROUP BY p.id, u.user_name, u.url, p.description , p.url, p.title_url, p.description_url, p.image_url, ur.user_name, r.user_id, r.created_at
    ) dum

ORDER BY created_at DESC
LIMIT 20;`);
  //   if (hashtag) {
  //     queryAppend = `JOIN post_hashtags ON post_hashtags.post_id = p.id
  //     JOIN hashtags ON hashtags.id = post_hashtags.hashtag_id
  //     WHERE hashtags.name ILIKE '${hashtag}'
  //     AND p.is_deleted = false`;
  //   }
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
  deletePost,
  getPosts,
  insertPostHashtagRelation,
  deletePostHashtagRelation,
  getPostById,
};

export default postsRepository;
