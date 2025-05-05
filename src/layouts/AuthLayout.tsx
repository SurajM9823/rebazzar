import { Outlet } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm py-4 px-6 flex justify-center">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-semibold text-blue-600">Rebazzar</span>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Rebazzar.com. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;