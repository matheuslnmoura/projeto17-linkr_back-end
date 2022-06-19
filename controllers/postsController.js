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
    // eslint-disable-next-line import/no-named-as-default-member
    const result = await postsRepository.insertPost(publish);
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
  console.log(posts);
  let found = false;
  let newPost = [];
  let dividedIndex = 0;

  for (let i = 0; i < posts.length; i += 1) {
    found = false;

    for (let j = dividedIndex; j < dividedLikesArray.length; j += 1) {
      if (posts[i].post_id === dividedLikesArray[j][0].post_id) {
        found = true;
        newPost.push({ ...posts[i], tooltipText: createTooltipText(userId, dividedLikesArray[j]) });
        dividedIndex += 1;
      }
    }

    if (!found) newPost.push({ ...posts[i], tolltipText: createTooltipText(userId, []) });
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

export async function getPosts(req, res) {
  try {
    const user = res.locals.user;
    let posts = await postsRepository.getPosts();
    let postsId = posts.rows.map((post) => post.post_id);

    const likes = await getLikesFromPostsRange(postsId[postsId.length - 1]);
    posts = addLikedProperty(user, likes.rows, posts.rows);
    const dividedLikes = divideLikesArray(likes.rows);
    console.log(addTooltipProperty(user.id, posts, dividedLikes));

    res.status(200).send(posts);
  } catch (e) {
    console.log('erro ao pegar os posts', e);
    res.status(500);
  }
}
