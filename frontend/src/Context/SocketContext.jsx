// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;
    
    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`);
    
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      
      // Register user with socket server
      newSocket.emit('registerUser', currentUser._id);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });
    
    setSocket(newSocket);
    
    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, [currentUser]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};