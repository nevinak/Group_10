import { Server } from 'socket.io';

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      broadcastOnlineUsers();
    }

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        broadcastOnlineUsers();
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getOnlineUsers = () => Array.from(onlineUsers.keys());

export const getSocketIdByUserId = (userId) => onlineUsers.get(userId);

const broadcastOnlineUsers = () => {
  if (!io) return;
  io.emit('onlineUsers', getOnlineUsers());
};
