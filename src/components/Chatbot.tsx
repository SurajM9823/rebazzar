import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi there! How can I help you with Rebazzar today?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        'hello': 'Hello! How can I help you today?',
        'hi': 'Hi there! How can I assist you with Rebazzar?',
        'help': 'I can help you with listing items, finding products, or answering questions about Rebazzar. What do you need assistance with?',
        'how to sell': 'To sell an item on Rebazzar, click the "Sell" button in the navigation, fill out the listing details, upload photos, and set your price!',
        'pricing': 'Pricing on Rebazzar is set by sellers. You can also enable bidding to let buyers make offers on your items.',
      };
      
      // Generate response based on user input keywords
      let botResponse = 'I\'m not sure how to help with that yet. You can ask me about selling items, finding products, or using Rebazzar features.';
      
      const lowerInput = input.toLowerCase();
      
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (lowerInput.includes(keyword)) {
          botResponse = response;
          break;
        }
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-20"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      {/* Chatbot dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-80 md:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col z-20 border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Rebazzar Assistant</h3>
            <button 
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 max-w-[80%] ${
                  message.isBot ? 'mr-auto' : 'ml-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 rounded-r-lg hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;