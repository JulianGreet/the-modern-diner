
import { cn } from '@/lib/utils';
import React from 'react';
import RestaurantSidebar from './RestaurantSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <RestaurantSidebar />
      <div className="flex-1 overflow-auto">
        <main className="h-full p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
