import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  location: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  createdAt: string;
  isBiddable: boolean;
  highestBid?: number;
}

interface ListingsContextType {
  listings: Listing[];
  fetchListings: () => Promise<void>;
  getListingById: (id: string) => Listing | undefined;
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'seller'>) => Promise<void>;
  updateListing: (id: string, listing: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  placeBid: (listingId: string, amount: number) => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

// Mock listings data
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro - Excellent Condition',
    description: 'Barely used iPhone 13 Pro, Pacific Blue, 256GB. Comes with original box and accessories.',
    price: 799,
    images: [
      'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5750004/pexels-photo-5750004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Electronics',
    condition: 'Like New',
    location: 'San Francisco, CA',
    seller: {
      id: '2',
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.9,
    },
    createdAt: '2023-09-15T14:30:00Z',
    isBiddable: true,
    highestBid: 750,
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket from the 90s. Size M. Minor wear but in great condition overall.',
    price: 120,
    images: [
      'https://images.pexels.com/photos/4052597/pexels-photo-4052597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Clothing',
    condition: 'Good',
    location: 'Portland, OR',
    seller: {
      id: '3',
      name: 'Emma Watson',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.7,
    },
    createdAt: '2023-09-10T09:15:00Z',
    isBiddable: false,
  },
  {
    id: '3',
    title: 'Mountain Bike - Trek X-Caliber 8',
    description: 'Trek X-Caliber 8 mountain bike, size L. 29" wheels, hydraulic disc brakes. Ridden for one season.',
    price: 650,
    images: [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Sports & Outdoors',
    condition: 'Good',
    location: 'Denver, CO',
    seller: {
      id: '4',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.5,
    },
    createdAt: '2023-09-05T16:45:00Z',
    isBiddable: true,
    highestBid: 600,
  },
  {
    id: '4',
    title: 'Mid-Century Modern Coffee Table',
    description: 'Authentic mid-century modern coffee table. Solid wood with tapered legs. Minor scratches.',
    price: 200,
    images: [
      'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Furniture',
    condition: 'Good',
    location: 'Austin, TX',
    seller: {
      id: '5',
      name: 'Sarah Miller',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.6,
    },
    createdAt: '2023-09-01T11:20:00Z',
    isBiddable: false,
  },
];

export const ListingsProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>(mockListings);

  const fetchListings = async () => {
    // In a real app, this would fetch from an API
    setListings(mockListings);
  };

  const getListingById = (id: string) => {
    return listings.find(listing => listing.id === id);
  };

  const createListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'seller'>) => {
    const newListing: Listing = {
      ...listing,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      // Mock seller data
      seller: {
        id: '1',
        name: 'Jane Doe',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.8,
      },
    };
    
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = async (id: string, updatedListing: Partial<Listing>) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === id ? { ...listing, ...updatedListing } : listing
      )
    );
  };

  const deleteListing = async (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const placeBid = async (listingId: string, amount: number) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === listingId ? 
          { ...listing, highestBid: amount > (listing.highestBid || 0) ? amount : listing.highestBid } : 
          listing
      )
    );
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        fetchListings,
        getListingById,
        createListing,
        updateListing,
        deleteListing,
        placeBid,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
};