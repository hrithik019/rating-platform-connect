
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoreList from './StoreList';
import ChangePasswordForm from './ChangePasswordForm';

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="stores">
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stores" className="mt-6">
          <StoreList />
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

export default UserDashboard;
