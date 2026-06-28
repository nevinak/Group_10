const Message = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${isOwn ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
        <p>{message.message}</p>
        <p className={`mt-1 text-[11px] ${isOwn ? 'text-sky-100' : 'text-slate-400'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default Message;
