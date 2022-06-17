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

    if (hashtags) hashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

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

export async function getPosts(req, res) {
  try {
    const result = await postsRepository.getPosts();
    res.status(200).send(result.rows);
  } catch (e) {
    console.log('erro ao pegar os posts', e);
    res.status(500);
  }
}
