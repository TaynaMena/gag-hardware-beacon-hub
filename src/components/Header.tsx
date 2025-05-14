
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="bg-gag-dark shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/logo/logo-white.svg" alt="GAG Hardware Hub" className="h-8" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-gag-cyan font-medium">
              Home
            </Link>
            <Link to="/" className="text-white hover:text-gag-cyan font-medium">
              Produtos
            </Link>
            <Link to="/" className="text-white hover:text-gag-cyan font-medium">
              Ofertas
            </Link>
            <Link to="/" className="text-white hover:text-gag-cyan font-medium">
              Suporte
            </Link>
          </nav>

          {/* Search toggle + Cart + User (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-white hover:text-gag-cyan"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-gag-cyan"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-gag-cyan"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar (Both Mobile and Desktop) */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gag-blue-dark animate-fade-in">
            <div className="flex items-center">
              <Input 
                type="text" 
                placeholder="Buscar produtos..." 
                className="flex-grow mr-4"
              />
              <Button className="bg-gag-blue hover:bg-gag-blue-dark text-white">Buscar</Button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gag-blue-dark animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-gag-cyan font-medium px-2 py-1">
                Home
              </Link>
              <Link to="/" className="text-white hover:text-gag-cyan font-medium px-2 py-1">
                Produtos
              </Link>
              <Link to="/" className="text-white hover:text-gag-cyan font-medium px-2 py-1">
                Ofertas
              </Link>
              <Link to="/" className="text-white hover:text-gag-cyan font-medium px-2 py-1">
                Suporte
              </Link>
              <Link to="/" className="text-white hover:text-gag-cyan font-medium px-2 py-1">
                Minha Conta
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
