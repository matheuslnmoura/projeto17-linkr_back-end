/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import router from './routers/masterRouter.js';

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

app.use(router);
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('search-value', (value) => {
    console.log(value);
  });
});
httpServer.listen(4005, () => {
  console.log('coneectadona porta 4005');
});
app.listen(process.env.PORT, () => {
  console.log(chalk.bold.blue('Server running on port', process.env.PORT));
});
