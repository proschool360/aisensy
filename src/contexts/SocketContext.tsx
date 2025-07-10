import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  sendMessage: (contactId: string, content: string, type?: string) => void;
  sendTicketMessage: (ticketId: string, content: string) => void;
  startTyping: (contactId: string) => void;
  stopTyping: (contactId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Listen for real-time events
      newSocket.on('message_sent', (message) => {
        console.log('Message sent:', message);
        // Handle message sent event
      });

      newSocket.on('message_received', (message) => {
        console.log('Message received:', message);
        // Handle message received event
      });

      newSocket.on('ticket_message', (message) => {
        console.log('Ticket message:', message);
        // Handle ticket message event
      });

      newSocket.on('user_typing', (data) => {
        console.log('User typing:', data);
        // Handle typing indicator
      });

      newSocket.on('user_stop_typing', (data) => {
        console.log('User stopped typing:', data);
        // Handle stop typing indicator
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [token, user]);

  const sendMessage = (contactId: string, content: string, type = 'text') => {
    if (socket && connected) {
      socket.emit('send_message', { contactId, content, type });
    }
  };

  const sendTicketMessage = (ticketId: string, content: string) => {
    if (socket && connected) {
      socket.emit('send_ticket_message', { ticketId, content });
    }
  };

  const startTyping = (contactId: string) => {
    if (socket && connected) {
      socket.emit('typing_start', { contactId });
    }
  };

  const stopTyping = (contactId: string) => {
    if (socket && connected) {
      socket.emit('typing_stop', { contactId });
    }
  };

  const value = {
    socket,
    connected,
    sendMessage,
    sendTicketMessage,
    startTyping,
    stopTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};