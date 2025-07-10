import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface RecentMessagesProps {
  messages: any[];
}

const RecentMessages: React.FC<RecentMessagesProps> = ({ messages }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'READ': return 'bg-purple-100 text-purple-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {message.contact?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {message.contact?.name || message.contact?.phone || 'Unknown Contact'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {message.content}
                </p>
                
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    message.direction === 'INBOUND' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {message.direction === 'INBOUND' ? 'Received' : 'Sent'}
                  </span>
                  <span className="text-xs text-gray-500">{message.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;