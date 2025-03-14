
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="border-b bg-white h-16 px-6 flex items-center justify-between">
      <h1 className="text-xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-[250px] pl-8 bg-gray-50 border-gray-200 focus-visible:ring-restaurant-burgundy" 
          />
        </div>
        
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-restaurant-burgundy">
            3
          </Badge>
        </div>
        
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Chef" />
          <AvatarFallback className="bg-restaurant-burgundy text-white">
            CH
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
