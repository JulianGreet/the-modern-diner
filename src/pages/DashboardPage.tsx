import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, MenuSquare, ClipboardList, Clock, BarChart3, Settings } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: 'Table Management',
      description: 'Manage tables, view status, and generate QR codes',
      icon: LayoutDashboard,
      path: '/tables',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Menu Management',
      description: 'Create and update menu items and categories',
      icon: MenuSquare,
      path: '/menu',
      color: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Order Management',
      description: 'View and process customer orders',
      icon: ClipboardList,
      path: '/orders',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Staff Management',
      description: 'Add and manage staff members',
      icon: Users,
      path: '/staff',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Reservations',
      description: 'Manage customer reservations',
      icon: Clock,
      path: '/reservations',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      title: 'Reports & Analytics',
      description: 'View restaurant performance metrics',
      icon: BarChart3,
      path: '/reports',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      title: 'Settings',
      description: 'Configure restaurant settings',
      icon: Settings,
      path: '/settings',
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant operations from this central dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item, index) => (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className={`${item.color} p-4`}>
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-sm text-gray-600">
                {item.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="outline" 
                className="w-full justify-center hover:bg-restaurant-burgundy hover:text-white"
                onClick={() => navigate(item.path)}
              >
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;