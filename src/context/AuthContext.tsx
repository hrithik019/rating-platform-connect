
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, address: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    address: '123 Admin St',
    role: UserRole.ADMIN,
    password: 'Admin123!'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    address: '456 User Ave',
    role: UserRole.USER,
    password: 'User123!'
  },
  {
    id: '3',
    name: 'Store Owner',
    email: 'store@example.com',
    address: '789 Store Blvd',
    role: UserRole.STORE_OWNER,
    password: 'Store123!'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check if the user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, address: string, password: string) => {
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already in use",
      });
      throw new Error('Email already in use');
    }

    // In a real app, this would be an API call
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      address,
      role: UserRole.USER,
      password
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    // In a real app, this would be an API call
    const userIndex = mockUsers.findIndex(u => u.id === user?.id);
    
    if (userIndex !== -1) {
      if (mockUsers[userIndex].password !== currentPassword) {
        toast({
          variant: "destructive",
          title: "Password update failed",
          description: "Current password is incorrect",
        });
        throw new Error('Current password is incorrect');
      }
      
      mockUsers[userIndex].password = newPassword;
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: "User not found",
      });
      throw new Error('User not found');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updatePassword,
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
