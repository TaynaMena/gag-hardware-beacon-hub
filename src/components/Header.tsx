
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-hub-blue">GAG</span>
              <span className="ml-2 text-xl text-hub-accent">Hardware Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium">
              Home
            </Link>
            <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium">
              Products
            </Link>
            <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium">
              Deals
            </Link>
            <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium">
              Support
            </Link>
          </nav>

          {/* Search toggle + Cart + User (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-hub-blue-light hover:text-hub-accent"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-hub-blue-light hover:text-hub-accent"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-hub-blue-light hover:text-hub-accent"
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
              className="text-hub-blue-light"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-hub-blue-light"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-hub-blue-light"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar (Both Mobile and Desktop) */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex items-center">
              <Input 
                type="text" 
                placeholder="Search for products..." 
                className="flex-grow mr-4"
              />
              <Button>Search</Button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium px-2 py-1">
                Home
              </Link>
              <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium px-2 py-1">
                Products
              </Link>
              <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium px-2 py-1">
                Deals
              </Link>
              <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium px-2 py-1">
                Support
              </Link>
              <Link to="/" className="text-hub-blue-light hover:text-hub-accent font-medium px-2 py-1">
                My Account
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
