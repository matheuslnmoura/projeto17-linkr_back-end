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

export async function publishPost(req, res) {
  const { url, description } = req.body;
  const userId = res.locals.user.id;

  try {
    const { image: imageUrl, description: descriptionUrl, title: titleUrl } = await urlMetadata(url);
    const publish = {
      userId, url, description, descriptionUrl, titleUrl, imageUrl,
    };
    // eslint-disable-next-line import/no-named-as-default-member
    const result = await postsRepository.insertPost(publish);
    res.status(201).send(publish);
  } catch (e) {
    console.log('erro ao publicar', e);
    res.status(500).send('Erro ao postar');
  }
}
