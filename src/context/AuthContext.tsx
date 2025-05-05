import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'seller';
  rating: number;
  location: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  role: 'buyer',
  rating: 4.8,
  location: 'San Francisco, CA',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    // Mock authentication - in a real app, this would call an API
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - in a real app, this would call an API
    setUser({
      ...mockUser,
      name,
      email,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = () => {
    if (user) {
      setUser({
        ...user,
        role: user.role === 'buyer' ? 'seller' : 'buyer',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};