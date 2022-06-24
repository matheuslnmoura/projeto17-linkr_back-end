/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import chalk from 'chalk';
import commentRepository from '../repositories/commentRepository.js';

export async function getComments(req, res) {
  const { postId } = req.params;

  try {
    const comments = (await commentRepository.getPostComments(postId)).rows;
    if (comments.length === 0) {
      console.log(chalk.bold.red('No comments returned'));
      return res.status(404).json({
        message: 'No commets yet',
      });
    }

    return res.send(comments);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // server error
  }
}

export async function postComment(req, res) {
  try {
    const { userId, postId, comment } = req.body;
    (await commentRepository.insertComment(userId, postId, comment));
    return res.status(201).send('Comment posted!');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.detail); // server error
  }
}
