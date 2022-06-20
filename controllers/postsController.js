/* eslint-disable import/no-named-as-default-member */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-empty */
import urlMetadata from 'url-metadata';
import postsRepository from '../repositories/postsRepository.js';
import { getLikesFromPostsRange } from '../repositories/likeRepository.js';
import { createTooltipText } from './likesController.js';
import hashtagRepository from '../repositories/hashtagRepository.js';

export async function publishPost(req, res) {
  const { url, description } = req.body;
  const userId = res.locals.user.id;

  try {
    const {
      image: imageUrl,
      description: descriptionUrl,
      title: titleUrl,
    } = await urlMetadata(url);
    const publish = {
      userId,
      url,
      description,
      descriptionUrl,
      titleUrl,
      imageUrl,
    };
    console.log({ publish });
    // eslint-disable-next-line import/no-named-as-default-member
    let hashtags = [];

    if (description) hashtags = description.match(/#\w+/g);

    if (hashtags) {
      hashtags = hashtags.map((hashtag) => {
        const hashtagName = hashtag.substring(1);
        return hashtagName.toLowerCase();
      });
    }

    const post = (await postsRepository.insertPost(publish)).rows[0];

    await Promise.all(
      hashtags.map(async (hashtag) => {
        const hashtagExist = (
          await hashtagRepository.getHashtagIdByName(hashtag)
        ).rows[0];

        if (hashtagExist) {
          await postsRepository.insertPostHashtagRelation(
            post.id,
            hashtagExist.id,
          );
        } else {
          const newHashtag = (await hashtagRepository.insertHashtag(hashtag))
            .rows[0];
          await postsRepository.insertPostHashtagRelation(
            post.id,
            newHashtag.id,
          );
        }
      }),
    );

    res.sendStatus(201);
  } catch (e) {
    console.log('erro ao publicar', e);
    res.status(500).send('Erro ao postar');
  }
}

function addLikedProperty(user, likes, postsArray) {
  const likesFromUser = likes.filter((post) => post.id === user.id);
  let hasLiked = false;
  const postsWithLiked = postsArray.map((post) => {
    hasLiked = false;
    const postId = post.post_id;
    for (let i = 0; i < likesFromUser.length; i += 1) {
      if (postId === likesFromUser[i].post_id) {
        hasLiked = true;
        break;
      }
    }
    return { ...post, liked: hasLiked };
  });
  return postsWithLiked;
}

function addTooltipProperty(userId, posts, dividedLikesArray) {
  let found = false;
  let newPost = [];
  let dividedIndex = 0;

  for (let i = 0; i < posts.length; i += 1) {
    found = false;

    for (let j = dividedIndex; j < dividedLikesArray.length; j += 1) {
      if (posts[i].post_id === dividedLikesArray[j][0].post_id) {
        found = true;
        newPost.push({
          ...posts[i],
          tooltipText: createTooltipText(userId, dividedLikesArray[j]),
        });
        dividedIndex += 1;
      }
    }

    if (!found) {
      newPost.push({ ...posts[i], tolltipText: createTooltipText(userId, []) });
    }
  }

  return newPost;
}

function divideLikesArray(likesArray) {
  let newLikesArray = [[]];

  let auxPostId = likesArray[0].post_id;
  for (let i = 0; i < likesArray.length; i += 1) {
    if (likesArray[i].post_id === auxPostId) {
      newLikesArray[newLikesArray.length - 1].push(likesArray[i]);
    } else {
      auxPostId = likesArray[i].post_id;
      newLikesArray.push([likesArray[i]]);
    }
  }
  return newLikesArray;
}

export async function editPost(req, res) {
  const { description } = req.body;
  const { postId } = req.params;
  const { user } = res.locals;

  try {
    let hashtags = [];

    if (description) hashtags = description.match(/#\w+/g);

    if (hashtags) {
      hashtags = hashtags.map((hashtag) => {
        const hashtagName = hashtag.substring(1);
        return hashtagName.toLowerCase();
      });
    }

    const isPostOwner = (await postsRepository.getPostById(postId)).rows[0].user_id === user.id;

    if (!isPostOwner) {
      res.sendStatus(403);
    }

    await postsRepository.deletePostHashtagRelation(postId);

    const post = (await postsRepository.editPost({ postId, description }))
      .rows[0];

    await Promise.all(
      hashtags.map(async (hashtag) => {
        const hashtagExist = (
          await hashtagRepository.getHashtagIdByName(hashtag)
        ).rows[0];

        if (hashtagExist) {
          await postsRepository.insertPostHashtagRelation(
            post.id,
            hashtagExist.id,
          );
        } else {
          const newHashtag = (await hashtagRepository.insertHashtag(hashtag))
            .rows[0];
          await postsRepository.insertPostHashtagRelation(
            post.id,
            newHashtag.id,
          );
        }
      }),
    );

    res.status(200).send(post);
  } catch (error) {
    console.log('erro ao editar o post', error);
    res.status(500);
  }
}

export async function getPosts(req, res) {
  const { id } = req.params;
  const { hashtag } = req.params;
  try {
    const user = res.locals.user;
    let posts = await postsRepository.getPosts(id, hashtag);
    let postsId = posts.rows.map((post) => post.post_id);

    const likes = await getLikesFromPostsRange(postsId[postsId.length - 1]);
    posts = addLikedProperty(user, likes.rows, posts.rows);
    const dividedLikes = divideLikesArray(likes.rows);
    posts = addTooltipProperty(user.id, posts, dividedLikes);

    res.status(200).send(posts);
  } catch (e) {
    console.log('erro ao pegar os posts', e);
    res.status(500);
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  const { user } = res.locals;

  try {
    const isPostOwner = (await postsRepository.getPostById(postId)).rows[0].user_id === user.id;

    if (!isPostOwner) {
      res.sendStatus(403);
    }

    await postsRepository.deletePost(postId);
    res.sendStatus(200);
  } catch (e) {
    console.log('erro ao deletar o post', e);
    res.status(500);
  }
}
