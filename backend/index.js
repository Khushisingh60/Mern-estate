import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import chatRouter from './routes/chat.route.js';
import adminRouter from './routes/admin.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import User from './models/user.model.js';
import Chat from './models/chat.model.js';
import paymentRouter from './routes/payment.route.js'

import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app); // HTTP server for Socket.IO

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cookieParser());
// In your server.js file:

app.use(cors({
  origin: 'https://mern-estate-p8u6-6tlzkm9ln-khushi-singhs-projects-d14f457b.vercel.app', // Your frontend URL
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Static files for Vite build
app.use(express.static(path.join(__dirname, '/client/dist')));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);
app.use('/api/payment',paymentRouter);

// Save/Unsave logic
app.post('/api/user/save/:userId', async (req, res) => {
  const { userId } = req.params;
  const { listingId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.savedPosts.includes(listingId)) {
      user.savedPosts = user.savedPosts.filter((id) => id !== listingId);
    } else {
      user.savedPosts.push(listingId);
    }

    await user.save();
    res.status(200).json({ success: true, savedPosts: user.savedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/user/unsave/:userId', async (req, res) => {
  const { userId } = req.params;
  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ success: false, message: 'Listing ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const listingObjectId = mongoose.Types.ObjectId.isValid(listingId)
      ? new mongoose.Types.ObjectId(listingId)
      : null;

    if (!listingObjectId) {
      return res.status(400).json({ success: false, message: 'Invalid listing ID' });
    }

    user.savedPosts = user.savedPosts.filter((id) => !id.equals(listingObjectId));
    await user.save();

    res.status(200).json({ success: true, savedPosts: user.savedPosts });
  } catch (error) {
    console.error('Error while unsaving the listing:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Inbox Route
app.get('/api/user/inbox/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all chats where the user is a participant
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username email')
    .populate('listingId', 'name imageUrls')
    .sort({ lastMessageTime: -1 });
    
    // Format the response
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId
      );
      
      return {
        chatId: chat._id,
        senderName: otherParticipant ? otherParticipant.username : 'Unknown User',
        senderId: otherParticipant ? otherParticipant._id : null,
        listingId: chat.listingId._id,
        listingName: chat.listingId.name,
        listingImage: chat.listingId.imageUrls[0],
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime,
        unreadCount: chat.messages.filter(m => !m.read && m.senderId.toString() !== userId).length
      };
    });
    
    res.status(200).json(formattedChats);
  } catch (error) {
    console.error('Inbox error:', error);
    res.status(500).json({ message: 'Error fetching inbox' });
  }
});

// Get individual chat messages
app.get('/api/user/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate('participants', 'username email')
      .populate('listingId', 'name imageUrls');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.status(200).json(chat.messages);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat messages' });
  }
});

// Fallback route for client SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ========== SOCKET.IO ==========
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('registerUser', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
      
      // Join a room named after the user ID
      socket.join(userId);
    }
  });

  // In your server.js file, update the 'sendMessage' socket handler:

socket.on('sendMessage', async ({ senderId, receiverId, message, listingId, chatId }) => {
  try {
    console.log('Message data received:', { senderId, receiverId, message, listingId, chatId });
    
    if (!senderId) {
      console.error('Missing senderId in message data');
      return;
    }
    
    let chat;
    
    // If chatId is provided, use existing chat
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      // Check if chat already exists between these users for this listing
      chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
        listingId: listingId
      });
      
      // Create new chat if none exists
      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          listingId: listingId,
          messages: []
        });
      }
    }
    
    // Add message to chat - ensure senderId is provided and valid
    const newMessage = {
      senderId: senderId, // Make sure this is explicitly set
      message,
      timestamp: new Date(),
      read: false
    };
    
    // Validate senderId before saving
    if (!newMessage.senderId) {
      throw new Error('SenderId is required for messages');
    }
    
    chat.messages.push(newMessage);
    chat.lastMessage = message;
    chat.lastMessageTime = new Date();
    
    await chat.save();
    
    // Send message to recipient if online
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        chatId: chat._id,
        senderId,
        message,
        timestamp: new Date()
      });
      
      // Notify about updated chat list
      io.to(receiverSocketId).emit('updateChatList');
    }
    
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

  socket.on('markAsRead', async ({ chatId, userId }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (chat) {
        // Mark all messages from other users as read
        let updated = false;
        chat.messages.forEach(msg => {
          if (msg.senderId.toString() !== userId && !msg.read) {
            msg.read = true;
            updated = true;
          }
        });
        
        if (updated) {
          await chat.save();
          
          // Notify sender that messages were read
          const otherParticipant = chat.participants.find(
            p => p.toString() !== userId
          );
          
          if (otherParticipant) {
            const senderSocketId = onlineUsers.get(otherParticipant.toString());
            if (senderSocketId) {
              io.to(senderSocketId).emit('messagesRead', { chatId });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('disconnect', () => {
    // Remove user from online users map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server and Socket.IO running on port ${PORT}!`);
});