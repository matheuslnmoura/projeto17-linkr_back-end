/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import usersRepository from '../repositories/userRepository.js';

dotenv.config();

export async function signup(req, res) {
  const { email, password, userName, imageUrl } = req.body;

  const hashCost = 10;
  const passwordHash = bcrypt.hashSync(password, hashCost);

  try {
    const emailAlreadyExists = (await usersRepository.getUserByEmail(email)).rows[0];

    if (emailAlreadyExists) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    await usersRepository.createUser({ email, password: passwordHash, userName, imageUrl });

    return res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;

  try {
    const user = (await usersRepository.getUserByEmail(email)).rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Email or password is incorrect',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email or password is incorrect',
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    return res.status(200).json({
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
