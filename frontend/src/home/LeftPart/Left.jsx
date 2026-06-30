import { useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Search from './Search';
import Users from './Users';
import Logout from './Logout';

const Left = ({ authUser, users, onlineUsers, searchTerm, setSearchTerm, onLogout }) => {
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { data } = await axios.post('/api/auth/profile-picture', { profilePic: reader.result }, { withCredentials: true });
        if (data.success) {
          toast.success('Profile picture updated');
          window.location.reload();
        }
      } catch {
        toast.error('Could not update profile picture');
      }
    };
    reader.readAsDataURL(file);
  };
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

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          {authUser?.profilePic ? <img src={authUser.profilePic} alt={authUser.fullName} className="h-full w-full object-cover" /> : <span className="text-sm font-semibold text-sky-400">{authUser?.fullName?.charAt(0).toUpperCase()}</span>}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{authUser?.fullName}</p>
          <p className="text-sm text-slate-400">Tap to change photo</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
      </div>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Users authUser={authUser} users={users} onlineUsers={onlineUsers} />
      <Logout onLogout={onLogout} />
    </aside>
  );
};

export default Left;
