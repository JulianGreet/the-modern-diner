
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Clipboard, 
  Users, 
  Clock, 
  BarChart4, 
  Settings,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal py-2 px-3 h-auto",
          active && "bg-restaurant-burgundy/10 text-restaurant-burgundy font-medium"
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
    { to: "/", label: "Tables", icon: LayoutGrid },
    { to: "/orders", label: "Orders", icon: Clipboard },
    { to: "/staff", label: "Staff", icon: Users },
    { to: "/reservations", label: "Reservations", icon: Clock },
    { to: "/reports", label: "Reports", icon: BarChart4 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div 
      className={cn(
        "h-full border-r border-border bg-card text-card-foreground shadow-sm transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-restaurant-burgundy">
            Restaurant
          </h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <React.Fragment key={item.to}>
              {collapsed ? (
                <Link to={item.to} className="flex justify-center py-2">
                  <item.icon 
                    size={24} 
                    className={cn(
                      "text-muted-foreground", 
                      location.pathname === item.to && "text-restaurant-burgundy"
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
      
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            Restaurant Manager v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantSidebar;
