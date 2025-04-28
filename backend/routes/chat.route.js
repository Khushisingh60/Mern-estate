// routes/chat.route.js
import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get all chats for a user
router.get('/chats/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username email')
    .populate('listingId', 'name imageUrls')
    .sort({ lastMessageTime: -1 });
    
    // Format the chats to include sender information
    const formattedChats = await Promise.all(chats.map(async (chat) => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId
      );
      
      return {
        chatId: chat._id,
        participants: chat.participants,
        listingId: chat.listingId,
        listingName: chat.listingId.name,
        listingImage: chat.listingId.imageUrls[0],
        otherUser: otherParticipant,
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime,
        unreadCount: chat.messages.filter(m => !m.read && m.senderId.toString() !== userId).length
      };
    }));
    
    res.status(200).json(formattedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific chat
router.get('/messages/:chatId', verifyToken, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user.id;
    
    const chat = await Chat.findById(chatId)
      .populate('participants', 'username email')
      .populate('listingId', 'name imageUrls');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== userId) {
        msg.read = true;
      }
    });
    
    await chat.save();
    
    res.status(200).json({
      chatId: chat._id,
      participants: chat.participants,
      listing: chat.listingId,
      messages: chat.messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { chatId, message, listingId, receiverId } = req.body;
    const senderId = req.user.userId;

    console.log(chatId);
    console.log(senderId);
    console.log(receiverId);
    console.log(listingId);
    console.log(message);
    let chat;
    
    // If chatId is provided, find existing chat
    if (chatId) {
      chat = await Chat.findById(chatId);
      
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      // Create a new chat if none exists
      const existingChat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        listingId: listingId
      });
      
      if (existingChat) {
        chat = existingChat;
      } else {
        chat = new Chat({
          participants: [senderId, receiverId],
          listingId: listingId,
          messages: []
        });
      }
    }
    
    // Add new message
    const newMessage = {
      senderId,
      message,
      timestamp: new Date(),
      read: false
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = message;
    chat.lastMessageTime = new Date();
    
    await chat.save();
    
    res.status(201).json({
      chatId: chat._id,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;