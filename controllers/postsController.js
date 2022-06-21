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
import { getAllLikes } from '../repositories/likeRepository.js';
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

function addTooltipProperty(userId, posts, dividedLikesArray) {
  let found = false;
  let newPost = [];

  for (let i = 0; i < posts.length; i += 1) {
    found = false;

    for (let j = 0; j < dividedLikesArray.length; j += 1) {
      if (posts[i].post_id === dividedLikesArray[j][0].post_id && found === false) {
        found = true;
        newPost.push({
          ...posts[i],
          tooltipText: createTooltipText(dividedLikesArray[j]),
        });
        break;
      }
    }

    if (!found) {
      newPost.push({ ...posts[i], tolltipText: createTooltipText([]) });
    }
  }

  return newPost;
}

function divideLikesArray(likesArray) {
  let newLikesArray = [[]];
  let count = 0;
  let auxPostId = likesArray[0].post_id;
  let sameIdLikeCount = 1;

  for (let i = 0; i < likesArray.length; i += 1) { // For externo que varre os likes de cada post
    if (likesArray[i].post_id === auxPostId && sameIdLikeCount < 2) { // Se esse id for o mesmo do anterior
      newLikesArray[newLikesArray.length - 1].push(likesArray[i]); // adiciona na mesma posição
      sameIdLikeCount += 1;
    } else { // Caso não for
      sameIdLikeCount = 1;
      auxPostId = likesArray[i].post_id; // Altera o ultimo id encontrado
      newLikesArray.push([likesArray[i]]); // Adiciona uma nova posição no array
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
  const { idParams } = req.params; // TODO Tratar id Params
  const { hashtag } = req.params;
  try {
    const user = res.locals.user;
    let posts = await postsRepository.getPosts(idParams, user.id, hashtag); // Query do banco
    const likes = await getAllLikes(user.id);
    const dividedLikes = divideLikesArray(likes.rows);
    posts = addTooltipProperty(user.id, posts.rows, dividedLikes);
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
