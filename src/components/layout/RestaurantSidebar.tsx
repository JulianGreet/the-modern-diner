
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Clock, 
  BarChart3, 
  Settings,
  MenuSquare,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SignOutButton from '@/components/auth/SignOutButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal py-2.5 px-3 h-auto rounded-md mb-1",
          active ? "bg-restaurant-burgundy/10 text-restaurant-burgundy font-medium" : "text-gray-600 hover:text-restaurant-burgundy"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const RestaurantSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/orders", label: "Orders", icon: ClipboardList },
    { to: "/menu", label: "Menu", icon: MenuSquare },
    { to: "/staff", label: "Staff", icon: Users },
    { to: "/reservations", label: "Reservations", icon: Clock },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div 
      className={cn(
        "h-full border-r border-gray-200 bg-white shadow-sm transition-all duration-300 flex flex-col z-10",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="flex items-center">
            <Avatar className="h-9 w-9 bg-restaurant-burgundy text-white">
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <h2 className="ml-2 text-lg font-semibold text-gray-800">
              Modern Diner
            </h2>
          </div>
        ) : (
          <Avatar className="h-9 w-9 bg-restaurant-burgundy text-white mx-auto">
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto text-gray-500", collapsed ? "mx-auto" : "")}
        >
          <ChevronLeft size={20} className={collapsed ? "rotate-180" : ""} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <React.Fragment key={item.to}>
              {collapsed ? (
                <Link to={item.to} className="flex justify-center py-3 px-0 my-1">
                  <item.icon 
                    size={22} 
                    className={cn(
                      "text-gray-600", 
                      location.pathname === item.to ? "text-restaurant-burgundy" : ""
                    )} 
                  />
                </Link>
              ) : (
                <SidebarLink 
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  active={location.pathname === item.to} 
                />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <Button variant="ghost" size="icon" className="w-full h-10 text-gray-600">
            <LogOut size={20} />
          </Button>
        ) : (
          <SignOutButton />
        )}
      </div>
    </div>
  );
};

export default RestaurantSidebar;
