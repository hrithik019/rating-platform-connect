
import React, { createContext, useContext, useState } from 'react';
import { Store, Rating, User, UserRole } from '../types';
import { useToast } from "@/components/ui/use-toast";

interface DataContextType {
  stores: Store[];
  users: User[];
  ratings: Rating[];
  addStore: (store: Omit<Store, 'id' | 'avgRating'>) => void;
  addUser: (user: Omit<User, 'id'>, password: string) => void;
  addRating: (storeId: string, userId: string, value: number) => void;
  updateRating: (ratingId: string, value: number) => void;
  getUserRating: (storeId: string, userId: string) => Rating | undefined;
  getStoreRatings: (storeId: string) => Rating[];
  getUsersWhoRatedStore: (storeId: string) => User[];
  getStoreById: (storeId: string) => Store | undefined;
  getStoresByOwner: (ownerId: string) => Store[];
  deleteUser: (userId: string) => void;
  deleteStore: (storeId: string) => void;
}

// Mock data
const mockStores: Store[] = [
  { id: '1', name: 'Tech Haven', email: 'info@techhaven.com', address: '123 Tech St', ownerId: '3', avgRating: 4.5 },
  { id: '2', name: 'Fashion World', email: 'contact@fashionworld.com', address: '456 Fashion Ave', ownerId: '3', avgRating: 3.8 },
  { id: '3', name: 'Food Delight', email: 'hello@fooddelight.com', address: '789 Food Blvd', ownerId: '3', avgRating: 4.2 },
];

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', address: '123 Admin St', role: UserRole.ADMIN },
  { id: '2', name: 'Regular User', email: 'user@example.com', address: '456 User Ave', role: UserRole.USER },
  { id: '3', name: 'Store Owner', email: 'store@example.com', address: '789 Store Blvd', role: UserRole.STORE_OWNER },
];

const mockRatings: Rating[] = [
  { id: '1', storeId: '1', userId: '2', value: 4, timestamp: new Date().toISOString() },
  { id: '2', storeId: '2', userId: '2', value: 3, timestamp: new Date().toISOString() },
  { id: '3', storeId: '3', userId: '2', value: 5, timestamp: new Date().toISOString() },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const { toast } = useToast();

  const addStore = (store: Omit<Store, 'id' | 'avgRating'>) => {
    const newStore: Store = {
      ...store,
      id: (stores.length + 1).toString(),
      avgRating: 0,
    };
    setStores([...stores, newStore]);
    toast({
      title: "Store added",
      description: `${newStore.name} has been added successfully`,
    });
  };

  const addUser = (user: Omit<User, 'id'>, password: string) => {
    // In a real app, password would be hashed and not stored in the same object
    const newUser: User = {
      ...user,
      id: (users.length + 1).toString(),
    };
    setUsers([...users, newUser]);
    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully`,
    });
  };

  const calculateAvgRating = (storeId: string): number => {
    const storeRatings = ratings.filter(r => r.storeId === storeId);
    if (storeRatings.length === 0) return 0;
    
    const sum = storeRatings.reduce((acc, curr) => acc + curr.value, 0);
    return parseFloat((sum / storeRatings.length).toFixed(1));
  };

  const updateStoreRating = (storeId: string) => {
    setStores(stores.map(store => 
      store.id === storeId 
        ? { ...store, avgRating: calculateAvgRating(storeId) } 
        : store
    ));
  };

  const addRating = (storeId: string, userId: string, value: number) => {
    // Check if user already rated this store
    const existingRating = ratings.find(r => r.storeId === storeId && r.userId === userId);
    
    if (existingRating) {
      // Update existing rating
      setRatings(ratings.map(r => 
        r.id === existingRating.id 
          ? { ...r, value, timestamp: new Date().toISOString() } 
          : r
      ));
    } else {
      // Add new rating
      const newRating: Rating = {
        id: (ratings.length + 1).toString(),
        storeId,
        userId,
        value,
        timestamp: new Date().toISOString(),
      };
      setRatings([...ratings, newRating]);
    }
    
    updateStoreRating(storeId);
    toast({
      title: "Rating submitted",
      description: "Your rating has been submitted successfully",
    });
  };

  const updateRating = (ratingId: string, value: number) => {
    const rating = ratings.find(r => r.id === ratingId);
    if (!rating) return;
    
    setRatings(ratings.map(r => 
      r.id === ratingId 
        ? { ...r, value, timestamp: new Date().toISOString() } 
        : r
    ));
    
    updateStoreRating(rating.storeId);
    toast({
      title: "Rating updated",
      description: "Your rating has been updated successfully",
    });
  };

  const getUserRating = (storeId: string, userId: string): Rating | undefined => {
    return ratings.find(r => r.storeId === storeId && r.userId === userId);
  };

  const getStoreRatings = (storeId: string): Rating[] => {
    return ratings.filter(r => r.storeId === storeId);
  };

  const getUsersWhoRatedStore = (storeId: string): User[] => {
    const userIds = ratings
      .filter(r => r.storeId === storeId)
      .map(r => r.userId);
    
    return users.filter(u => userIds.includes(u.id));
  };

  const getStoreById = (storeId: string): Store | undefined => {
    return stores.find(s => s.id === storeId);
  };

  const getStoresByOwner = (ownerId: string): Store[] => {
    return stores.filter(s => s.ownerId === ownerId);
  };

  const deleteUser = (userId: string) => {
    // Delete user's ratings first
    setRatings(ratings.filter(r => r.userId !== userId));
    
    // Delete user
    const userToDelete = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    
    // If user is store owner, delete their stores too
    if (userToDelete?.role === UserRole.STORE_OWNER) {
      setStores(stores.filter(s => s.ownerId !== userId));
    }
    
    toast({
      title: "User deleted",
      description: "User has been deleted successfully",
    });
  };

  const deleteStore = (storeId: string) => {
    // Delete store's ratings first
    setRatings(ratings.filter(r => r.storeId !== storeId));
    
    // Delete store
    setStores(stores.filter(s => s.id !== storeId));
    
    toast({
      title: "Store deleted",
      description: "Store has been deleted successfully",
    });
  };

  return (
    <DataContext.Provider
      value={{
        stores,
        users,
        ratings,
        addStore,
        addUser,
        addRating,
        updateRating,
        getUserRating,
        getStoreRatings,
        getUsersWhoRatedStore,
        getStoreById,
        getStoresByOwner,
        deleteUser,
        deleteStore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
