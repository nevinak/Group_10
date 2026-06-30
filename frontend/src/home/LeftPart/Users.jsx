import User from './User';

const Users = ({ authUser, users, onlineUsers }) => {
  return (
    <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-1">
      {users.map((user) => (
        <User key={user._id} user={user} isOnline={onlineUsers.includes(user._id)} authUser={authUser} />
      ))}
    </div>
  );
};

export default Users;
