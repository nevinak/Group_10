import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const state = {
  users: [],
  conversations: [],
  messages: [],
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const seedDemoData = () => {
  if (state.users.length > 0) return;

  const demoOne = {
    _id: randomUUID(),
    fullName: 'Demo One',
    email: 'demo1@example.com',
    password: bcrypt.hashSync('demo1234', 10),
  };

  const demoTwo = {
    _id: randomUUID(),
    fullName: 'Demo Two',
    email: 'demo2@example.com',
    password: bcrypt.hashSync('demo1234', 10),
  };

  state.users.push(demoOne, demoTwo);

  const conversation = {
    _id: randomUUID(),
    members: [demoOne._id, demoTwo._id].sort(),
    messageIds: [],
  };

  state.conversations.push(conversation);

  const welcomeMessage = {
    _id: randomUUID(),
    senderId: demoTwo._id,
    receiverId: demoOne._id,
    message: 'Welcome to the demo chat! Use the other demo account in a second window to reply.',
    createdAt: new Date().toISOString(),
  };

  state.messages.push(welcomeMessage);
  conversation.messageIds.push(welcomeMessage._id);
};

seedDemoData();

export const createUser = async ({ fullName, email, password }) => {
  const existingUser = state.users.find((user) => user.email === email);
  if (existingUser) return null;

  const user = {
    _id: randomUUID(),
    fullName,
    email,
    password: await bcrypt.hash(password, 10),
  };

  state.users.push(user);
  return sanitizeUser(user);
};

export const getUserByEmail = (email) => {
  return state.users.find((user) => user.email === email);
};

export const getUserById = (id) => {
  return state.users.find((user) => user._id === id);
};

export const verifyPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

export const getUsersExcept = (currentUserId) => {
  return state.users.filter((user) => user._id !== currentUserId).map(sanitizeUser);
};

export const getOrCreateConversation = (senderId, receiverId) => {
  const members = [senderId, receiverId].sort();
  let conversation = state.conversations.find((entry) => entry.members.every((member, index) => member === members[index]));

  if (!conversation) {
    conversation = {
      _id: randomUUID(),
      members,
      messageIds: [],
    };

    state.conversations.push(conversation);
  }

  return conversation;
};

export const addMessage = ({ senderId, receiverId, message }) => {
  const conversation = getOrCreateConversation(senderId, receiverId);
  const newMessage = {
    _id: randomUUID(),
    senderId,
    receiverId,
    message,
    createdAt: new Date().toISOString(),
  };

  state.messages.push(newMessage);
  conversation.messageIds.push(newMessage._id);
  return newMessage;
};

export const getMessagesForUsers = (senderId, receiverId) => {
  const conversation = getOrCreateConversation(senderId, receiverId);
  return conversation.messageIds
    .map((messageId) => state.messages.find((message) => message._id === messageId))
    .filter(Boolean);
};
