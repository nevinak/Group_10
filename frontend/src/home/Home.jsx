import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import { useSocket } from '../context/SocketProvider';
import useConversation from '../zustand/useConversation';
import Left from './LeftPart/Left';
import Right from './RightPart/Right';

const Home = () => {
  const { authUser, logout } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedConversation, messages, setMessages, appendMessage } = useConversation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/auth/allusers', { withCredentials: true });
        if (data.success) setUsers(data.users);
      } catch (error) {
        toast.error('Could not load users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        const { data } = await axios.get(`/api/messages/get/${selectedConversation._id}`, { withCredentials: true });
        if (data.success) setMessages(data.messages);
      } catch {
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [selectedConversation, setMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (payload) => {
      if (payload.senderId === authUser?._id) return;
      if (selectedConversation?._id === payload.senderId || selectedConversation?._id === payload.receiverId) {
        appendMessage(payload);
      } else {
        toast('New message received', { icon: '💬' });
      }

      const audio = new Audio('https://www.soundjay.com/button/sounds/button-4.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    };

    socket.on('newMessage', handleIncomingMessage);
    return () => socket.off('newMessage', handleIncomingMessage);
  }, [appendMessage, authUser?._id, selectedConversation?._id, socket]);

  const filteredUsers = users.filter((user) => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      logout();
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-3 text-slate-100 md:p-6">
      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl md:flex-row">
        <Left authUser={authUser} users={filteredUsers} onlineUsers={onlineUsers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onLogout={handleLogout} />
        <Right authUser={authUser} messages={messages} users={users} onlineUsers={onlineUsers} />
      </div>
    </div>
  );
};

export default Home;
