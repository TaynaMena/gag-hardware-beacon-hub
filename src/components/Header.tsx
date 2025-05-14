
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

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

          {/* Right side navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/admin-produtos" className="text-white hover:text-blue-200">
              <div className="flex items-center gap-1">
                <Settings className="h-5 w-5" />
                <span>Admin</span>
              </div>
            </Link>
            
            <Link to="/carrinho" className="relative">
              <Button variant="ghost" className="text-white">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrinho</span>
                  {totalItems > 0 && (
                    <Badge className="ml-1 bg-blue-500">
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
