
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Auth from './Auth';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Auth />;
};

export default Index;
