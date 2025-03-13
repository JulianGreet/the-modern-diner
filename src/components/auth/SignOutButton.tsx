
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SignOutButton: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start px-2">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </Button>
  );
};

export default SignOutButton;
