
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gag-blue-dark text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">GAG Hardware Hub</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:text-gag-purple transition-colors">
              Home
            </Link>
            <Link to="/admin-produtos" className="hover:text-gag-purple transition-colors">
              <Package className="inline mr-1" size={16} />
              Admin
            </Link>
            <Link to="/carrinho" className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>Carrinho</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gag-purple">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} GAG Hardware Hub - Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};

export default Layout;
