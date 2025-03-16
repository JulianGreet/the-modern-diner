
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [navigate, user, isLoading]);

  const handleSignIn = () => {
    navigate("/auth", { state: { activeTab: "login" } });
  };

  const handleSignUp = () => {
    navigate("/auth", { state: { activeTab: "signup" } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <h1 className="text-4xl font-bold mb-4">Loading Restaurant Manager...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-restaurant-burgundy/10 to-restaurant-burgundy/5">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-restaurant-burgundy mb-6">
          Modern Diner
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl">
          The complete solution for managing your restaurant operations, from table reservations to menu management.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleSignIn} 
            className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90 py-6 px-8 text-lg"
            size="lg"
          >
            <LogIn className="mr-2" />
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            variant="outline" 
            className="border-restaurant-burgundy text-restaurant-burgundy hover:bg-restaurant-burgundy/10 py-6 px-8 text-lg"
            size="lg"
          >
            <UserPlus className="mr-2" />
            Sign Up
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Table Management</h3>
              <p className="text-gray-600">
                Easily manage table reservations, assignments, and status updates in real-time.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Menu Management</h3>
              <p className="text-gray-600">
                Create and update your menu items, categories, and pricing with just a few clicks.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Staff Coordination</h3>
              <p className="text-gray-600">
                Track staff assignments, schedules, and performance all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Restaurant Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
