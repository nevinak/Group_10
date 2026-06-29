import axios from 'axios';
import toast from 'react-hot-toast';

const Message = ({ message, isOwn, onDelete }) => {
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/messages/delete/${message._id}`, { withCredentials: true });
      if (data.success) {
        onDelete?.(message._id);
        toast.success('Message deleted');
      }
    } catch {
      toast.error('Could not delete message');
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${isOwn ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
        {message.messageType === 'image' && message.imageUrl ? (
          <img src={message.imageUrl} alt="shared media" className="mb-2 max-h-64 rounded-xl object-cover" />
        ) : null}
        {message.message ? <p>{message.message}</p> : null}
        <div className={`mt-1 flex items-center justify-between gap-2 text-[11px] ${isOwn ? 'text-sky-100' : 'text-slate-400'}`}>
          <p>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {isOwn ? (
            <button type="button" onClick={handleDelete} className="font-semibold underline-offset-2 hover:underline">
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
