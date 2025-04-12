
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN:
        return 'System Administrator';
      case UserRole.USER:
        return 'Normal User';
      case UserRole.STORE_OWNER:
        return 'Store Owner';
      default:
        return 'User';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Store Rating Platform</h1>
            {user && (
              <span className="text-sm text-muted-foreground">
                - {getRoleLabel(user.role)}
              </span>
            )}
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {user.name}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4">
        {children}
      </main>
      
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Store Rating Platform
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
