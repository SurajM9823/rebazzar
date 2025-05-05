import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Chatbot from '../components/Chatbot';

const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Set page title based on current route
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Rebazzar - Second-hand Marketplace',
      '/profile': 'Your Profile',
      '/create-listing': 'Sell an Item',
      '/my-listings': 'My Listings',
      '/messages': 'Messages',
      '/notifications': 'Notifications',
      '/settings': 'Settings',
    };
    
    const defaultTitle = 'Rebazzar.com';
    document.title = pageTitles[location.pathname] || defaultTitle;
  }, [location]);

  const hideBottomNav = location.pathname.includes('/messages/');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>
      
      {!hideBottomNav && <BottomNavigation />}
      {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default MainLayout;