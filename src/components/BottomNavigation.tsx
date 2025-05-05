import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { conversations } = useChat();
  
  const unreadMessages = conversations.reduce((count, conv) => count + conv.unreadCount, 0);
  
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="w-6 h-6" />,
      authRequired: false,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: <Search className="w-6 h-6" />,
      authRequired: false,
    },
    {
      name: 'Sell',
      path: '/create-listing',
      icon: <PlusCircle className="w-6 h-6" />,
      authRequired: true,
    },
    {
      name: 'Chat',
      path: '/messages',
      icon: (
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </div>
      ),
      authRequired: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-6 h-6" />,
      authRequired: true,
    },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          // If auth is required and user is not authenticated, redirect to login
          const path = item.authRequired && !isAuthenticated ? '/login' : item.path;
          
          return (
            <Link
              key={item.name}
              to={path}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;