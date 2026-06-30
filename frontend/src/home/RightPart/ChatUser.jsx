const ChatUser = ({ user, isOnline }) => {
  return (
    <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950/70 px-4 py-4">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 font-semibold text-sky-400">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-500"></span>}
      </div>
      <div>
        <h3 className="font-semibold">{user?.fullName || 'Conversation'}</h3>
        <p className="text-sm text-slate-400">{isOnline ? 'Online now' : 'Offline'}</p>
      </div>
    </div>
  );
};

export default ChatUser;
