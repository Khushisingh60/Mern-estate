import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { format } from 'date-fns';

export default function Inbox() {
  const { currentUser } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const messageEndRef = useRef(null);
  
  // Connect to Socket.IO
  useEffect(() => {
    if (!currentUser) return;
    
    socketRef.current = io('http://localhost:3000');
    socketRef.current.emit('registerUser', currentUser._id);
    
    // Handle incoming messages
    socketRef.current.on('receiveMessage', (data) => {
      if (selectedChat && selectedChat === data.chatId) {
        setMessages(prev => [...prev, data]);
      }
      
      // Update chat list to reflect new message
      fetchChats();
    });
    
    socketRef.current.on('newChat', () => {
      fetchChats();
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser, selectedChat]);
  
  // Fetch user's chats
  const fetchChats = async () => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/chat/chats/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch chats');
      
      const data = await res.json();
      setChats(data);
    } catch (err) {
      setError('Failed to load chats. Please try again.');
      console.error(err);
    }
  };
  
  // Initial load of chats
  useEffect(() => {
    fetchChats();
  }, [currentUser]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Select a chat and load messages
  const handleSelectChat = async (chatId) => {
    if (selectedChat === chatId) return;
    
    setSelectedChat(chatId);
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`http://localhost:3000/api/chat/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch messages');
      
      const data = await res.json();
      setChatData(data);
      setMessages(data.messages);
      
      // Update chat list to reflect read status
      fetchChats();
    } catch (err) {
      setError('Failed to load messages. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
  
    try {
      const otherUser = chatData.participants.find(
        (p) => p._id !== currentUser._id
      ); // ✅ Move this to the top before using it
  
      const res = await fetch(`http://localhost:3000/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat,
          message: newMessage,
          senderId: currentUser._id,
          receiverId: otherUser._id,
        }),
      });
  
      if (!res.ok) throw new Error('Failed to send message');
  
      const data = await res.json();
  
      const newMsg = {
        senderId: currentUser._id,
        message: newMessage,
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
      fetchChats();
  
      socketRef.current.emit('sendMessage', {
        chatId: selectedChat,
        senderId: currentUser._id,
        receiverId: otherUser._id,
        message: newMessage,
      });
    } catch (err) {
      console.error('Send message error:', err);
    }
  };
  
  
  // Format timestamp
  const formatMessageTime = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  const formatChatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // If today, show time
    if (now.toDateString() === messageDate.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    // If this week, show day
    const diff = (now - messageDate) / (1000 * 60 * 60 * 24);
    if (diff < 7) {
      return format(messageDate, 'EEE');
    }
    
    // Otherwise show date
    return format(messageDate, 'MMM d');
  };
  
  // Handle "Enter" key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat list sidebar */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4 bg-gray-200">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        
        <div className="divide-y">
          {chats.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No messages yet
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => handleSelectChat(chat.chatId)}
                className={`p-3 flex items-start cursor-pointer hover:bg-gray-100 ${
                  selectedChat === chat.chatId ? 'bg-blue-50' : ''
                }`}
              >
                {/* Profile image */}
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 mr-3 overflow-hidden">
                  {chat.listingImage && (
                    <img
                      src={chat.listingImage}
                      alt={chat.listingName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Chat details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">
                      {chat.otherUser?.username || 'User'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatChatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {chat.listingName}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <span className="inline-block bg-green-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-3 bg-gray-200 flex items-center">
              {chatData && (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                    <img
                      src={chatData.listing?.imageUrls?.[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {chatData.participants.find(p => p._id !== currentUser._id)?.username}
                    </h3>
                    <Link 
                      to={`/listing/${chatData.listing?._id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {chatData.listing?.name}
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 p-4">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          msg.senderId === currentUser._id
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white border rounded-bl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.senderId === currentUser._id ? 'text-blue-100' : 'text-gray-500'
                          } text-right`}
                        >
                          {formatMessageTime(msg.timestamp)}
                          {msg.senderId === currentUser._id && (
                            <span className="ml-1">
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-3 bg-white border-t">
              <div className="flex items-center">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type a message..."
                  rows="2"
                ></textarea>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="ml-2 bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}