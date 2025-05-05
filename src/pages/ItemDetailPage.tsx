import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  Heart, 
  Share, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle 
} from 'lucide-react';

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById, placeBid } = useListings();
  const { isAuthenticated, user } = useAuth();
  const { startNewConversation } = useChat();
  
  const [listing, setListing] = useState(id ? getListingById(id) : undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundListing = getListingById(id);
      setListing(foundListing);
      
      if (foundListing?.isBiddable && foundListing.highestBid) {
        setBidAmount(foundListing.highestBid + 5); // Suggest a bid $5 higher than current
      } else if (foundListing) {
        setBidAmount(foundListing.price * 0.9); // Default to 90% of asking price
      }
    }
  }, [id, getListingById]);
  
  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <p className="mb-6">The listing you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, we would call an API to save this to the user's favorites
  };
  
  const shareItem = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this listing on Rebazzar: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const conversationId = await startNewConversation(listing.seller.id, listing.id);
    navigate(`/messages/${conversationId}`);
  };
  
  const handleBid = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!bidAmount) {
      setBidError('Please enter a bid amount.');
      return;
    }
    
    const minBid = (listing.highestBid || listing.price * 0.8) + 1;
    
    if (bidAmount < minBid) {
      setBidError(`Bid must be at least $${minBid.toFixed(2)}`);
      return;
    }
    
    await placeBid(listing.id, Number(bidAmount));
    setShowBidForm(false);
    setBidError(null);
    
    // Refresh listing data to see updated bid
    const updatedListing = getListingById(listing.id);
    if (updatedListing) {
      setListing(updatedListing);
    }
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };
  
  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const isOwnListing = user?.id === listing.seller.id;
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Image Gallery */}
      <div className="relative rounded-lg overflow-hidden mb-6 bg-gray-100">
        <div className="relative pb-[75%]">
          {listing.images.length > 0 ? (
            <img 
              src={listing.images[activeImageIndex]} 
              alt={listing.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          
          {listing.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full focus:outline-none ${
                      index === activeImageIndex ? 'bg-blue-600' : 'bg-white bg-opacity-60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between mb-4">
        <button 
          onClick={toggleFavorite}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          <span>{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
        
        <button 
          onClick={shareItem}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md"
        >
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
      
      {/* Listing Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {listing.title}
        </h1>
        
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-gray-600 text-sm">{listing.location}</span>
        </div>
        
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold text-gray-900 mr-2">
            ${listing.price}
          </span>
          
          {listing.isBiddable && listing.highestBid && (
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Highest Bid: ${listing.highestBid}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            {listing.category}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            {listing.condition}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
            Posted {new Date(listing.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-gray-700 mb-6 whitespace-pre-line">
          {listing.description}
        </p>
        
        {/* Bid/Contact Buttons */}
        {!isOwnListing && (
          <div className="flex flex-col sm:flex-row gap-3">
            {listing.isBiddable && (
              <button 
                onClick={() => setShowBidForm(!showBidForm)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
              >
                {listing.highestBid ? 'Place a Higher Bid' : 'Place Bid'}
              </button>
            )}
            
            <button 
              onClick={handleContactSeller}
              className="flex-1 flex justify-center items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Seller</span>
            </button>
          </div>
        )}
        
        {/* Bid Form */}
        {showBidForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Place Your Bid</h3>
            <div className="mb-2">
              <label htmlFor="bid-amount" className="block text-sm text-gray-600 mb-1">
                Bid Amount ($)
              </label>
              <input
                id="bid-amount"
                type="number"
                min={0}
                step="0.01"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value === '' ? '' : Number(e.target.value));
                  setBidError(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {bidError && (
                <p className="text-red-500 text-sm mt-1">{bidError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowBidForm(false)}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleBid}
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Bid
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Seller Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Seller Information</h2>
        <Link to={isOwnListing ? '/profile' : `/profile/${listing.seller.id}`} className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img 
              src={listing.seller.avatar} 
              alt={listing.seller.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{listing.seller.name}</p>
            <div className="flex items-center text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{listing.seller.rating.toFixed(1)} · Member since 2023</span>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Similar Items */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-3">Similar Items</h2>
        <p className="text-gray-500 text-center py-6">
          Similar items will appear here.
        </p>
      </div>
    </div>
  );
};

export default ItemDetailPage;