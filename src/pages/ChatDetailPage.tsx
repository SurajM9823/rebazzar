import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { ArrowLeft, ChevronLeft, Send, Image, DollarSign } from 'lucide-react';

const ChatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, messages, fetchMessages, sendMessage } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [conversation, setConversation] = useState(
    id ? conversations.find(c => c.id === id) : undefined
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      fetchMessages(id);
      const foundConversation = conversations.find(c => c.id === id);
      setConversation(foundConversation);
    }
  }, [id, fetchMessages, conversations]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!id || messageInput.trim() === '') return;
    
    await sendMessage(id, messageInput);
    setMessageInput('');
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  if (!conversation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Conversation not found</h2>
        <button 
          onClick={() => navigate('/messages')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Messages
        </button>
      </div>
    );
  }
  
  const groupedMessages: { date: string; messages: typeof messages }[] = [];
  
  // Group messages by date
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message);
    } else {
      groupedMessages.push({ date, messages: [message] });
    }
  });
  
  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/messages')}
            className="p-1 mr-3"
            aria-label="Back to messages"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src={conversation.participantAvatar} 
              alt={conversation.participantName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <h2 className="font-medium">{conversation.participantName}</h2>
            {conversation.listingTitle && (
              <p className="text-xs text-gray-500">
                Re: {conversation.listingTitle}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                {group.date}
              </span>
            </div>
            
            {group.messages.map((message) => {
              const isCurrentUser = message.senderId === '1'; // Current user id
              
              return (
                <div 
                  key={message.id} 
                  className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-200 p-2 flex space-x-2">
        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
          <Image className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
          <DollarSign className="w-5 h-5" />
        </button>
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className={`ml-2 p-2 rounded-full ${
              messageInput.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetailPage;