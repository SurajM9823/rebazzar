import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ onSelectCategory }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Mock categories with emoji icons
  const categories: Category[] = [
    { id: 'all', name: 'All', icon: '🏠' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'toys', name: 'Toys', icon: '🧸' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'jewelry', name: 'Jewelry', icon: '💍' },
    { id: 'art', name: 'Art', icon: '🎨' },
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    const newCategory = categoryId === activeCategory ? null : categoryId;
    setActiveCategory(newCategory);
    onSelectCategory(newCategory === 'all' ? null : newCategory);
  };
  
  const scrollLeft = () => {
    const container = document.getElementById('category-container');
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 200);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    const container = document.getElementById('category-container');
    if (container) {
      const newPosition = scrollPosition + 200;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          onClick={scrollLeft}
          className="bg-white rounded-full shadow-md p-1 focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div 
        id="category-container"
        className="flex space-x-3 overflow-x-auto py-3 px-4 hide-scrollbar"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center min-w-[72px] p-2 rounded-lg transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl mb-1">{category.icon}</span>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
      
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          onClick={scrollRight}
          className="bg-white rounded-full shadow-md p-1 focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;