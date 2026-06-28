import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useConversation from '../../zustand/useConversation';

const TypeSend = ({ authUser, receiverId }) => {
  const [message, setMessage] = useState('');
  const { appendMessage } = useConversation();

  const handleSend = async () => {
    if (!message.trim()) return;

    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: authUser?._id,
      receiverId,
      message,
      createdAt: new Date().toISOString(),
    };

    appendMessage(optimisticMessage);
    setMessage('');

    try {
      const { data } = await axios.post(`/api/messages/send/${receiverId}`, { message }, { withCredentials: true });
      if (!data.success) {
        toast.error('Failed to send');
      }
    } catch {
      toast.error('Failed to send');
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-slate-800 bg-slate-950/70 p-4">
      <input
        className="input input-bordered flex-1 bg-slate-900/80"
        placeholder="Type a message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && handleSend()}
      />
      <button type="button" className="btn btn-primary" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default TypeSend;
