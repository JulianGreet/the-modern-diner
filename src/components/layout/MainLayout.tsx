
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Table Management';
    case '/orders':
      return 'Order Management';
    case '/menu':
      return 'Menu Management';
    case '/staff':
      return 'Staff Management';
    case '/reservations':
      return 'Reservations';
    case '/reports':
      return 'Reports & Analytics';
    case '/settings':
      return 'Settings';
    default:
      return 'Restaurant Manager';
  }
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      <RestaurantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
