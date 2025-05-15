
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, ShoppingCart, User, Users, Search } from 'lucide-react';

const Header: React.FC = () => {
  const { items } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gag-cyan/20 shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/eb34af22-c138-4004-a47b-ecfe0724a94c.png" 
                alt="GAG Hardware" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Search - Desktop */}
          {!isMobile && (
            <div className="relative mx-4 flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  className="gag-input w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gag-cyan" />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              className="text-gag-white p-2"
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
                  <Link to="/produtos">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Produtos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/ofertas">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Ofertas
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/sobre">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Sobre
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Cart and Account Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" className="bg-transparent border-gag-cyan/40 text-gag-white hover:bg-gag-cyan/10 hover:border-gag-cyan">
                <User className="h-5 w-5" />
                {!isMobile && <span className="ml-2">Entrar</span>}
              </Button>
            </Link>
            
            <Link to="/carrinho">
              <Button variant="default" className="bg-gag-blue hover:bg-gag-blue-dark relative">
                <ShoppingCart className="h-5 w-5" />
                {!isMobile && <span className="ml-2">Carrinho</span>}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gag-lime text-gag-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="px-4 pb-4 bg-black/90 border-t border-gag-cyan/10 animate-fade-in">
          {/* Mobile Search */}
          <div className="py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="gag-input w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gag-cyan" />
              </div>
            </div>
          </div>
          
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/produtos"
              className="text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/ofertas"
              className="text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Ofertas
            </Link>
            <Link
              to="/sobre"
              className="text-gag-white py-2 px-3 rounded hover:bg-gag-cyan/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
