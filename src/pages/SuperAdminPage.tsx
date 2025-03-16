import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, BarChart3, Settings, Search, Plus, Trash } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
}

// Mock data for demonstration
const mockRestaurants: Restaurant[] = [
  { id: '1', name: 'Modern Diner', email: 'contact@moderndiner.com', createdAt: '2023-10-15', status: 'active' },
  { id: '2', name: 'Pasta Palace', email: 'info@pastapalace.com', createdAt: '2023-11-02', status: 'active' },
  { id: '3', name: 'Sushi Spot', email: 'hello@sushistop.com', createdAt: '2023-12-10', status: 'pending' },
];

const SuperAdminPage: React.FC = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveRestaurant = (id: string) => {
    // In a real app, this would call an API to remove the restaurant
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
  };

  const handleAddRestaurant = () => {
    // In a real app, this would open a form to add a new restaurant
    alert('Add restaurant functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage all restaurants and platform settings from this central dashboard.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleAddRestaurant}
          className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Restaurant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-restaurant-burgundy" />
                  <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                    restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-sm text-gray-600 mb-2">
                {restaurant.email}
              </CardDescription>
              <p className="text-xs text-gray-500">
                Joined: {new Date(restaurant.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button 
                variant="outline" 
                className="text-restaurant-burgundy border-restaurant-burgundy hover:bg-restaurant-burgundy hover:text-white"
                onClick={() => window.location.href = `/admin/restaurants/${restaurant.id}`}
              >
                View Details
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => handleRemoveRestaurant(restaurant.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="bg-blue-100 p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-700" />
              <CardTitle className="text-lg">User Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="text-sm text-gray-600">
              Manage platform users and permissions
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-center hover:bg-restaurant-burgundy hover:text-white"
              onClick={() => window.location.href = '/admin/users'}
            >
              Manage
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-indigo-100 p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-700" />
              <CardTitle className="text-lg">Platform Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="text-sm text-gray-600">
              View platform-wide analytics and insights
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-center hover:bg-restaurant-burgundy hover:text-white"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              View
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-gray-100 p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg">Platform Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="text-sm text-gray-600">
              Configure platform-wide settings
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full justify-center hover:bg-restaurant-burgundy hover:text-white"
              onClick={() => window.location.href = '/admin/settings'}
            >
              Configure
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPage;