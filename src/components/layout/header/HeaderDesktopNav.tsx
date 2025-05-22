
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/services/categoryService';
import { Home, Package, Tag, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface HeaderDesktopNavProps {
  isActive: (path: string) => boolean;
}

const HeaderDesktopNav: React.FC<HeaderDesktopNavProps> = ({ isActive }) => {
  // Fetch all categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });
  
  const navItems = [
    { path: '/', label: 'Início', icon: <Home size={18} /> },
    { path: '/vitrine', label: 'Vitrine', icon: <Package size={18} /> },
    { path: '/ofertas', label: 'Ofertas', icon: <Tag size={18} /> },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path}>
          <Button
            variant="ghost"
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'text-gag-cyan bg-gag-dark/50' 
                : 'text-gray-300 hover:text-gag-white hover:bg-gag-dark/30'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
      
      {/* Categories Dropdown */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-gag-dark/30 hover:text-gag-white text-gray-300">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span>Categorias</span>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-black/90 backdrop-blur-md border border-gag-cyan/30 p-2 min-w-[200px]">
              <ul className="grid gap-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      to={`/vitrine?category=${category.id}`}
                      className="block px-4 py-2 text-gray-300 hover:bg-gag-blue/20 hover:text-gag-white rounded-md"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default HeaderDesktopNav;
