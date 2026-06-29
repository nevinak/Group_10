import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import { initSocket } from './socket/server.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5004;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Chat API is running' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lc_chat_app');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }

  initSocket(server);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
