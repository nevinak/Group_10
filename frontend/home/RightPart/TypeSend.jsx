import { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useConversation from '../../zustand/useConversation';

const emojiOptions = ['😀', '😂', '😍', '🥳', '🔥', '👍', '❤️', '🎉'];

const TypeSend = ({ authUser, receiverId }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { appendMessageToConversation, selectedConversation } = useConversation();

  const handleSend = async (overrideText = message, type = 'text', imageUrl = '') => {
    const text = overrideText?.trim();
    if (type === 'text' && !text) return;
    if (type === 'image' && !imageUrl) return;

    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: authUser?._id,
      receiverId,
      message: text || '',
      messageType: type,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    appendMessageToConversation(selectedConversation?._id, optimisticMessage);
    setMessage('');
    setShowEmojiPicker(false);

    try {
      const { data } = await axios.post(`/api/messages/send/${receiverId}`, { message: text, type, imageUrl }, { withCredentials: true });
      if (!data.success) {
        toast.error('Failed to send');
      }
    } catch {
      toast.error('Failed to send');
    }
  };

  const handleImagePick = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => handleSend('', 'image', reader.result);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/70 p-4">
      {showEmojiPicker && (
        <div className="mb-3 flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2">
          {emojiOptions.map((emoji) => (
            <button key={emoji} type="button" className="rounded-lg p-2 text-xl hover:bg-slate-800" onClick={() => { setMessage((prev) => prev + emoji); setShowEmojiPicker(false); }}>
              {emoji}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShowEmojiPicker((prev) => !prev)}>😀</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => fileInputRef.current?.click()}>📷</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        <input
          className="input input-bordered flex-1 bg-slate-900/80"
          placeholder="Type a message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleSend()}
        />
        <button type="button" className="btn btn-primary" onClick={() => handleSend()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TypeSend;
