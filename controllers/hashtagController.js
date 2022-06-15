/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import hashtagRepository from '../repositories/hashtagRepository.js';

export async function getHashtag(req, res) {
  const { hashtag } = req.params;
  try {
    const result = (await hashtagRepository.getHashtagByName(hashtag)).rows;

    if (result.length === 0) {
      return res.status(404).json({
        message: 'No posts found with this hashtag :(',
      });
    }

    return res.send(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }
}

export async function getTrendingHashtags(req, res) {
  try {
    const result = (await hashtagRepository.getMostUsedHashtags()).rows;
    const hashtagsNamesInOrder = [];

    if (result.length === 0) {
      return res.status(404).json({
        message: 'No hashtags found on any of the posts :(',
      });
    }

    result.forEach((item) => hashtagsNamesInOrder.push(item.name.toLowerCase()));

    return res.send(hashtagsNamesInOrder);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }
}
