import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { Search, MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  const { conversations, fetchConversations } = useChat();
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {conversations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/messages/${conversation.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="p-4 flex">
                  <div className="flex-shrink-0 mr-3 relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participantName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    {conversation.listingTitle && (
                      <p className="text-xs text-gray-500 mb-1">
                        Re: {conversation.listingTitle}
                      </p>
                    )}
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
            <p className="text-gray-500 mt-1">
              Your conversations will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;