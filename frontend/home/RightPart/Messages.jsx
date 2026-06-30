import Message from './Message';

const Messages = ({ messages, authUser, onDeleteMessage }) => {
  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <Message key={message._id} message={message} isOwn={message.senderId?.toString() === authUser?._id} onDelete={onDeleteMessage} />
      ))}
    </div>
  );
};

export default Messages;
