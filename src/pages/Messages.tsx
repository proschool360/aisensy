import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { PaperAirplaneIcon, PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Message } from '../types';

const Messages: React.FC = () => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      contactId: 'Alice Johnson',
      content: 'Hello! I received your message about the new product launch.',
      type: 'text',
      direction: 'inbound',
      status: 'read',
      timestamp: new Date('2024-01-07T14:30:00'),
    },
    {
      id: '2',
      contactId: 'Alice Johnson',
      content: 'Thank you for your interest in our services. We will get back to you soon.',
      type: 'text',
      direction: 'outbound',
      status: 'delivered',
      timestamp: new Date('2024-01-07T14:25:00'),
    },
    {
      id: '3',
      contactId: 'Bob Smith',
      content: 'Your order has been processed and will be shipped within 24 hours.',
      type: 'template',
      direction: 'outbound',
      status: 'read',
      timestamp: new Date('2024-01-07T14:20:00'),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Messages" 
        subtitle="Manage your WhatsApp conversations" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Contact List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Conversations</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-full overflow-y-auto">
              <div className="p-4 hover:bg-gray-50 cursor-pointer bg-blue-50 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AJ</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Alice Johnson</p>
                    <p className="text-sm text-gray-500 truncate">Hello! I received your message...</p>
                  </div>
                  <div className="text-xs text-gray-500">2:30 PM</div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">BS</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Bob Smith</p>
                    <p className="text-sm text-gray-500 truncate">Your order has been processed...</p>
                  </div>
                  <div className="text-xs text-gray-500">2:20 PM</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AJ</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alice Johnson</p>
                  <p className="text-sm text-gray-500">+1234567890</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.direction === 'outbound'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <DocumentIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;