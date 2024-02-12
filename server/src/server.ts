import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index.js';
import { createServer } from "http";
import { Server, Socket } from 'socket.io'
import { getUpdatedPrices } from 'helpers/index.js';
import * as dotenv from 'dotenv';

const app = express();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", (socket: Socket) => {
  console.log('a user connected');

  socket.on('join list room', (listId: string) => {
    socket.join(`List${listId}`);
  })
  socket.on('leave list room', (listId: string) => {
    socket.leave(`List${listId}`);
  })

  socket.on('task added', (resData, tasks, listId: string) => {
    tasks.push(resData.task);
    const newTasks = getUpdatedPrices(tasks, resData.updatedTaskPrices);
    io.to(`List${listId}`).emit('new tasks', newTasks);
  });

  socket.on('task edited', (resData, tasks, listId: string) => {
    tasks.splice(tasks.findIndex((el: Record<string, string>) => el._id === resData.task._id), 1, resData.task);
    const newTasks = getUpdatedPrices(tasks, resData.updatedTaskPrices);
    io.to(`List${listId}`).emit('new tasks', newTasks);
  });

  socket.on('task deleted', (resData, tasks, listId: string) => {
    tasks.splice(tasks.findIndex((el: Record<string, string>) => el._id === resData.task._id), 1);
    const newTasks = getUpdatedPrices(tasks, resData.updatedTaskPrices);
    io.to(`List${listId}`).emit('new tasks', newTasks);
  });

  socket.on('task completed', (resData, tasks, listId: string) => {
    tasks.splice(tasks.findIndex((el: Record<string, string>) => el._id === resData.task._id), 1, resData.task);
    io.to(`List${listId}`).emit('new tasks', tasks);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});

dotenv.config();
const mongodbUri = process.env.MONGO_URI;

mongoose.Promise = Promise;
mongoose.connect(mongodbUri);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());