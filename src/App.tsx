
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import TablesPage from "./pages/TablesPage";
import OrdersPage from "./pages/OrdersPage";
import StaffPage from "./pages/StaffPage";
import ReservationsPage from "./pages/ReservationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><TablesPage /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
          <Route path="/staff" element={<MainLayout><StaffPage /></MainLayout>} />
          <Route path="/reservations" element={<MainLayout><ReservationsPage /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><ReportsPage /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
