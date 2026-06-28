import { useEffect, useRef } from 'react';
import ChatUser from './ChatUser';
import Messages from './Messages';
import TypeSend from './TypeSend';
import useConversation from '../../zustand/useConversation';

const Right = ({ authUser, messages, users, onlineUsers }) => {
  const { selectedConversation } = useConversation();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <section className="flex flex-1 items-center justify-center bg-slate-900/50 p-6">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center shadow-xl">
          <h2 className="text-2xl font-semibold">Welcome {authUser?.fullName || 'there'}</h2>
          <p className="mt-3 text-slate-400">Select a chat to start messaging with your contacts.</p>
        </div>
      </section>
    );
  }

  const receiver = users.find((user) => user._id === selectedConversation._id);
  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <section className="flex flex-1 flex-col bg-slate-900/70">
      <ChatUser user={receiver || selectedConversation} isOnline={isOnline} />
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
        <Messages messages={messages} authUser={authUser} />
      </div>
      <TypeSend authUser={authUser} receiverId={selectedConversation._id} />
    </section>
  );
};

export default Right;
