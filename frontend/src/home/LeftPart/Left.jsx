import Search from './Search';
import Users from './Users';
import Logout from './Logout';

const Left = ({ authUser, users, onlineUsers, searchTerm, setSearchTerm, onLogout }) => {
  return (
    <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-950/70 p-4 md:w-[32%] md:border-b-0 md:border-r">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Workspace</p>
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
          {onlineUsers.length} online
        </div>
      </div>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Users authUser={authUser} users={users} onlineUsers={onlineUsers} />
      <Logout onLogout={onLogout} />
    </aside>
  );
};

export default Left;
