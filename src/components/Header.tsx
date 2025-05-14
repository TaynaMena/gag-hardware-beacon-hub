import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

const Header: React.FC = () => {
  const { items } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-navy-dark bg-[#01036d] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/3c9dcd17-393d-4323-834c-ed34a5d7eb30.png" 
                alt="GAG Hardware" 
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Navigation - Desktop */}
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Início
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/login">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <User className="mr-1 h-4 w-4" /> Área do Vendedor
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Cart Button */}
          <Link to="/carrinho" className="ml-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-800">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Carrinho {totalItems > 0 && `(${totalItems})`}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-white py-2 px-3 rounded hover:bg-blue-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/admin/login"
              className="text-white py-2 px-3 rounded hover:bg-blue-800 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Área do Vendedor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
