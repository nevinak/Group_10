import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getIO, getSocketIdByUserId } from '../socket/server.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, type = 'text', imageUrl = '' } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver is required' });
    }

    if (type === 'image' && !imageUrl) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    if (type === 'text' && !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({ members: [senderId, receiverId] });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message || '',
      messageType: type === 'image' ? 'image' : 'text',
      imageUrl: type === 'image' ? imageUrl : '',
    });
    conversation.messages.push(newMessage._id);
    await conversation.save();

    const payload = {
      _id: newMessage._id,
      senderId,
      receiverId,
      message: newMessage.message,
      messageType: newMessage.messageType,
      imageUrl: newMessage.imageUrl,
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

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own messages' });
    }

    await Message.findByIdAndDelete(id);

    await Conversation.updateMany(
      { messages: id },
      { $pull: { messages: id } }
    );

    const io = getIO();
    if (io) {
      io.emit('messageDeleted', { messageId: id });
    }

    return res.status(200).json({ success: true, messageId: id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
