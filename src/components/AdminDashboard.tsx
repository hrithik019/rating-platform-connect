
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from '@/context/DataContext';
import { UserPlus, Store, Star, UserCog } from 'lucide-react';
import UserList from './UserList';
import StoreList from './StoreList';
import UserForm from './UserForm';
import StoreForm from './StoreForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const { users, stores, ratings } = useData();
  const [dialogContent, setDialogContent] = useState<'addUser' | 'addStore' | null>(null);
  
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stores
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ratings
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratings.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>
          
          <Dialog open={dialogContent !== null} onOpenChange={(isOpen) => !isOpen && setDialogContent(null)}>
            {dialogContent === 'addUser' && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user.
                  </DialogDescription>
                </DialogHeader>
                <UserForm 
                  onSuccess={() => setDialogContent(null)}
                />
              </DialogContent>
            )}
            
            {dialogContent === 'addStore' && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new store.
                  </DialogDescription>
                </DialogHeader>
                <StoreForm 
                  onSuccess={() => setDialogContent(null)}
                />
              </DialogContent>
            )}
            
            <div className="space-x-2">
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setDialogContent('addUser')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setDialogContent('addStore')}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Add Store
                </Button>
              </DialogTrigger>
            </div>
          </Dialog>
        </div>
        
        <TabsContent value="users" className="mt-0">
          <UserList />
        </TabsContent>
        
        <TabsContent value="stores" className="mt-0">
          <StoreList showRatingControls={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
