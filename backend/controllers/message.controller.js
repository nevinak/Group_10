import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getIO, getSocketIdByUserId } from '../socket/server.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!message || !receiverId) {
      return res.status(400).json({ success: false, message: 'Message and receiver are required' });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({ members: [senderId, receiverId] });
    }

    const newMessage = await Message.create({ senderId, receiverId, message });
    conversation.messages.push(newMessage._id);
    await conversation.save();

    const payload = {
      _id: newMessage._id,
      senderId,
      receiverId,
      message: newMessage.message,
      createdAt: newMessage.createdAt,
    };

    const io = getIO();
    const receiverSocketId = getSocketIdByUserId(receiverId);
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit('newMessage', payload);
    }

    return res.status(201).json({ success: true, message: payload });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate('messages');

    const messages = (conversation?.messages || [])
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((msg) => (msg.toObject ? msg.toObject() : msg));

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
