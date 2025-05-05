import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  listingId?: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  listingId?: string;
  listingTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  startNewConversation: (participantId: string, listingId?: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '2',
    participantName: 'John Smith',
    participantAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    listingId: '1',
    listingTitle: 'iPhone 13 Pro - Excellent Condition',
    lastMessage: 'Is this still available?',
    lastMessageTime: '2023-09-15T18:30:00Z',
    unreadCount: 1,
  },
  {
    id: '2',
    participantId: '3',
    participantName: 'Emma Watson',
    participantAvatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    listingId: '2',
    listingTitle: 'Vintage Leather Jacket',
    lastMessage: 'Would you take $100 for it?',
    lastMessageTime: '2023-09-14T14:15:00Z',
    unreadCount: 0,
  },
];

// Mock messages data
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '101',
      senderId: '2',
      receiverId: '1',
      content: 'Hi, is the iPhone still available?',
      timestamp: '2023-09-15T18:15:00Z',
      listingId: '1',
      read: true,
    },
    {
      id: '102',
      senderId: '1',
      receiverId: '2',
      content: 'Yes, it is!',
      timestamp: '2023-09-15T18:20:00Z',
      listingId: '1',
      read: true,
    },
    {
      id: '103',
      senderId: '2',
      receiverId: '1',
      content: 'Great! What\'s the lowest you can go on the price?',
      timestamp: '2023-09-15T18:25:00Z',
      listingId: '1',
      read: true,
    },
    {
      id: '104',
      senderId: '2',
      receiverId: '1',
      content: 'Is this still available?',
      timestamp: '2023-09-15T18:30:00Z',
      listingId: '1',
      read: false,
    },
  ],
  '2': [
    {
      id: '201',
      senderId: '3',
      receiverId: '1',
      content: 'I love that jacket! Is it true to size?',
      timestamp: '2023-09-14T14:00:00Z',
      listingId: '2',
      read: true,
    },
    {
      id: '202',
      senderId: '1',
      receiverId: '3',
      content: 'Yes, it fits like a standard medium.',
      timestamp: '2023-09-14T14:05:00Z',
      listingId: '2',
      read: true,
    },
    {
      id: '203',
      senderId: '3',
      receiverId: '1',
      content: 'Would you take $100 for it?',
      timestamp: '2023-09-14T14:15:00Z',
      listingId: '2',
      read: true,
    },
  ],
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchConversations = async () => {
    // In a real app, this would call an API
    setConversations(mockConversations);
  };

  const fetchMessages = async (conversationId: string) => {
    // In a real app, this would call an API
    const conversationMessages = mockMessages[conversationId] || [];
    setMessages(conversationMessages);
    
    // Mark messages as read
    if (conversationMessages.length > 0) {
      const updatedConversations = conversations.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      setConversations(updatedConversations);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      senderId: '1', // Current user
      receiverId: conversations.find(c => c.id === conversationId)?.participantId || '',
      content,
      timestamp: new Date().toISOString(),
      listingId: conversations.find(c => c.id === conversationId)?.listingId,
      read: false,
    };

    // In a real app, this would call an API
    // Update messages state
    setMessages(prev => [...prev, newMessage]);

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? 
          { 
            ...conv, 
            lastMessage: content, 
            lastMessageTime: newMessage.timestamp,
            unreadCount: 0, // Reset unread count for the sender
          } : 
          conv
      )
    );
  };

  const startNewConversation = async (participantId: string, listingId?: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find(
      c => c.participantId === participantId && (!listingId || c.listingId === listingId)
    );
    
    if (existingConv) {
      setActiveConversation(existingConv.id);
      return existingConv.id;
    }

    // Mock creating a new conversation
    const newConvId = Math.random().toString(36).substring(2, 11);
    
    // In a real app, this would call an API to get participant details and create a conversation
    const newConversation: Conversation = {
      id: newConvId,
      participantId,
      participantName: 'New Contact',
      participantAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      listingId,
      listingTitle: listingId ? 'Item of interest' : undefined,
      lastMessage: 'Started a conversation',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConvId);

    return newConvId;
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        fetchConversations,
        fetchMessages,
        sendMessage,
        setActiveConversation,
        startNewConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};