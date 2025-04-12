
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import AppLayout from '@/components/AppLayout';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import StoreOwnerDashboard from '@/components/StoreOwnerDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <AppLayout>
      {user?.role === UserRole.ADMIN && <AdminDashboard />}
      {user?.role === UserRole.USER && <UserDashboard />}
      {user?.role === UserRole.STORE_OWNER && <StoreOwnerDashboard />}
    </AppLayout>
  );
};

export default Dashboard;
