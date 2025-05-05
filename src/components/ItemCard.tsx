import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Listing } from '../context/ListingsContext';

interface ItemCardProps {
  listing: Listing;
  onFavorite?: (id: string, isFavorite: boolean) => void;
}

const ItemCard = ({ listing, onFavorite }: ItemCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !isFavorite;
    setIsFavorite(newState);
    
    if (onFavorite) {
      onFavorite(listing.id, newState);
    }
  };
  
  return (
    <Link 
      to={`/item/${listing.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
    >
      <div className="relative pb-[75%] overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <button 
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          }`}
          onClick={handleFavorite}
        >
          <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        
        {listing.isBiddable && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
            Bidding
          </div>
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 line-clamp-2">{listing.title}</h3>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">
              ${listing.isBiddable && listing.highestBid && listing.highestBid > listing.price 
                ? listing.highestBid 
                : listing.price}
            </p>
            {listing.isBiddable && listing.highestBid && (
              <p className="text-xs text-gray-500">Current bid</p>
            )}
          </div>
          
          <div className="text-xs text-gray-500">{listing.location}</div>
        </div>
        
        <div className="mt-auto pt-2 flex items-center">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img 
              src={listing.seller.avatar} 
              alt={listing.seller.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-1 text-xs text-gray-500">
            {listing.seller.name} · {listing.seller.rating.toFixed(1)}★
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;