
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Star, Users } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import StarRating from './StarRating';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getStoresByOwner, getUsersWhoRatedStore } = useData();
  
  const stores = useMemo(() => {
    return user ? getStoresByOwner(user.id) : [];
  }, [user, getStoresByOwner]);
  
  const usersWhoRated = useMemo(() => {
    if (!stores.length) return [];
    
    // Get all users who rated any of the owner's stores
    const allUsers = stores.flatMap(store => getUsersWhoRatedStore(store.id));
    
    // Remove duplicates
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex((u) => u.id === user.id)
    );
    
    return uniqueUsers;
  }, [stores, getUsersWhoRatedStore]);
  
  const averageRating = useMemo(() => {
    if (!stores.length) return 0;
    
    const sum = stores.reduce((acc, store) => acc + store.avgRating, 0);
    return parseFloat((sum / stores.length).toFixed(1));
  }, [stores]);
  
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Stores
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">{averageRating}</div>
            <StarRating rating={averageRating} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users Rated
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWhoRated.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stores">
        <TabsList>
          <TabsTrigger value="stores">My Stores</TabsTrigger>
          <TabsTrigger value="users">Users Who Rated</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>{store.name}</TableCell>
                          <TableCell>{store.email}</TableCell>
                          <TableCell>{store.address}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StarRating rating={store.avgRating} />
                              <span>({store.avgRating.toFixed(1)})</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={4} 
                          className="h-24 text-center"
                        >
                          You don't have any stores yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users Who Rated My Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersWhoRated.length > 0 ? (
                      usersWhoRated.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.address}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={3} 
                          className="h-24 text-center"
                        >
                          No users have rated your stores yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-md mx-auto">
            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreOwnerDashboard;
