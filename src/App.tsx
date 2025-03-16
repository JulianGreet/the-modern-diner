
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TablesPage from '@/pages/TablesPage';
import MenuPage from '@/pages/MenuPage';
import OrdersPage from '@/pages/OrdersPage';
import ReservationsPage from '@/pages/ReservationsPage';
import StaffPage from '@/pages/StaffPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import OrderPage from '@/pages/OrderPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof Error) {
          console.error("Mutation error:", error);
        }
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="restaurant-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/order/:restaurantId/:tableId" element={<OrderPage />} />
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/tables" element={<TablesPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
