
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Sign Out Failed',
        description: error.message || 'An error occurred during sign out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-muted" 
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign Out</span>
    </Button>
  );
};

export default SignOutButton;
