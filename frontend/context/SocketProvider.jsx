import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthProvider';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useMemo(() => {
    if (!authUser?._id) return null;
    return io('http://localhost:5000', {
      query: { userId: authUser._id },
      withCredentials: true,
    });
  }, [authUser?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('onlineUsers', (users) => setOnlineUsers(users));

    return () => {
      socket.off('onlineUsers');
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
