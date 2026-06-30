import useConversation from '../../zustand/useConversation';

const User = ({ user, isOnline, authUser }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  return (
    <button
      type="button"
      onClick={() => setSelectedConversation(user)}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${selectedConversation?._id === user._id ? 'border-sky-500 bg-slate-800' : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'}`}
    >
      <div className="relative">
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.fullName} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/20 font-semibold text-sky-400">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
        )}
        {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-500"></span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium">{user.fullName}</p>
          {isOnline && <span className="text-xs text-emerald-400">online</span>}
        </div>
        <p className="truncate text-sm text-slate-400">{authUser?._id === user._id ? 'You' : 'Tap to chat'}</p>
      </div>
    </button>
  );
};

export default User;
