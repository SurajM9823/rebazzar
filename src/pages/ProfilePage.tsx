import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { User, ShoppingBag, Star, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

const ProfilePage = () => {
  const { user, logout, switchRole } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    );
  }
  
  // Get user's listings
  const userListings = listings.filter(listing => listing.seller.id === user.id);
  
  // Mock reviews
  const reviews = [
    {
      id: '1',
      reviewer: {
        id: '2',
        name: 'John Smith',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      rating: 5,
      comment: 'Great seller! The item was exactly as described and shipping was fast.',
      date: '2023-08-25T15:30:00Z',
    },
    {
      id: '2',
      reviewer: {
        id: '3',
        name: 'Emma Watson',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      rating: 4,
      comment: 'Good experience overall. Communication could be a bit faster.',
      date: '2023-07-15T09:45:00Z',
    },
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleRoleSwitch = () => {
    switchRole();
    setIsMenuOpen(false);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{user.rating.toFixed(1)} · Member since 2023</span>
              </div>
              <div className="mt-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded inline-flex items-center">
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>{user.role === 'buyer' ? 'Buyer' : 'Seller'}</span>
              </div>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button 
                    onClick={handleRoleSwitch}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Switch to {user.role === 'buyer' ? 'Seller' : 'Buyer'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          <p className="text-gray-600">
            Hi there! I'm passionate about finding unique items and giving them a second life.
            Based in {user.location}.
          </p>
        </div>
        
        {/* Stats */}
        <div className="mt-6 flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{userListings.length}</p>
            <p className="text-sm text-gray-600">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-sm text-gray-600">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Sales</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                activeTab === 'listings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'listings' && (
            <>
              {userListings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userListings.map(listing => (
                    <div key={listing.id}>
                      <ItemCard listing={listing} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No listings yet</h3>
                  <p className="text-gray-500 mt-1 mb-4">
                    When you list items for sale, they will appear here.
                  </p>
                  <button
                    onClick={() => navigate('/create-listing')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Create Listing
                  </button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'reviews' && (
            <>
              {reviews.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {reviews.map(review => (
                    <li key={review.id} className="py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <img 
                            src={review.reviewer.avatar} 
                            alt={review.reviewer.name}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <p className="font-medium">{review.reviewer.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="text-gray-500 mt-1">
                    Reviews from buyers and sellers will appear here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;