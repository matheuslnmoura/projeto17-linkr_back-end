import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userRepository from '../repositories/userRepository.js';

dotenv.config();

export default async function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: 'Missing token',
    });
  }

  if (authorization.slice(0, 7) !== 'Bearer ') {
    return res.status(422).json({
      message: 'Invalid authorization header',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = (await userRepository.getUserById(decoded.id)).rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Invalid token user',
      });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.status(500).json(error);
  }
}
