/* eslint-disable import/extensions */
/* eslint-disable no-console */
import express, { json } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import router from './routers/masterRouter.js';

const app = express();

app.use(cors());
app.use(json());
dotenv.config();

app.use(router);

const httpServer = http.createServer(app);

const io = new Server(httpServer);

httpServer.listen(process.env.PORT_SOCKET, () => {
  console.log(chalk.bold.blue('Server HTTP running on port', process.env.PORT_SOCKET));
});

app.listen(process.env.PORT, () => {
  console.log(chalk.bold.blue('Server HTTPS running on port', process.env.PORT));
});

export default { httpServer, io };
