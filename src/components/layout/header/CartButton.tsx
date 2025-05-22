
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const CartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link to="/carrinho">
      <Button variant="ghost" className="relative px-3 text-gray-300 hover:text-gag-white">
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gag-cyan text-gag-dark text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
