import { useEffect, useState } from 'react';
import { Listing, useListings } from '../context/ListingsContext';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import { Filter, MapPin, SlidersHorizontal } from 'lucide-react';

const HomePage = () => {
  const { listings, fetchListings } = useListings();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  
  useEffect(() => {
    let result = [...listings];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Apply location filter
    if (selectedLocation) {
      result = result.filter(item => item.location.includes(selectedLocation));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'price_low') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    
    setFilteredListings(result);
  }, [listings, selectedCategory, selectedLocation, sortBy]);
  
  const handleFavorite = (id: string, isFavorite: boolean) => {
    console.log('Favorite toggled:', id, isFavorite);
    // In a real app, this would update a user's favorites in the backend
  };
  
  const toggleLocationModal = () => {
    setIsLocationModalOpen(!isLocationModalOpen);
  };
  
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };
  
  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Denver, CO',
    'Portland, OR',
    'Seattle, WA',
    'Chicago, IL',
    'Los Angeles, CA',
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Category filter */}
      <CategoryFilter onSelectCategory={setSelectedCategory} />
      
      {/* Filters row */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={toggleLocationModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 text-sm hover:bg-gray-50"
          >
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{selectedLocation || 'All locations'}</span>
          </button>
          
          <button 
            onClick={toggleFilterModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full border border-gray-300 text-sm hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span>Filters</span>
          </button>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_low' | 'price_high')}
            className="text-sm border border-gray-300 rounded-md p-1"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {/* Listings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredListings.map(listing => (
          <div key={listing.id} className="h-full">
            <ItemCard 
              listing={listing}
              onFavorite={handleFavorite} 
            />
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or check back later.</p>
        </div>
      )}
      
      {/* Location selection modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Select location</h3>
            </div>
            
            <div className="p-4">
              <button
                onClick={() => {
                  setSelectedLocation(null);
                  toggleLocationModal();
                }}
                className={`w-full text-left px-4 py-3 rounded-md mb-2 ${
                  selectedLocation === null ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                All locations
              </button>
              
              {locations.map(location => (
                <button
                  key={location}
                  onClick={() => {
                    setSelectedLocation(location);
                    toggleLocationModal();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-md mb-2 ${
                    selectedLocation === location ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={toggleLocationModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Filters</h3>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <div className="space-y-2">
                  {['New', 'Like New', 'Good', 'Fair', 'Poor'].map(condition => (
                    <div key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`condition-${condition}`}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <label
                        htmlFor={`condition-${condition}`}
                        className="ml-2 text-gray-700"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fixed-price"
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label
                      htmlFor="fixed-price"
                      className="ml-2 text-gray-700"
                    >
                      Fixed Price
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bidding"
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label
                      htmlFor="bidding"
                      className="ml-2 text-gray-700"
                    >
                      Bidding Enabled
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <button
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                Reset All
              </button>
              
              <div className="space-x-2">
                <button
                  onClick={toggleFilterModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={toggleFilterModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;