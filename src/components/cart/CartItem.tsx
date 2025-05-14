
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-gray-500">
                Sem imagem
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-blue-900">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Preço unitário: R$ {(item.price || 0).toFixed(2)}
            </p>
            <p className="font-medium text-blue-800">
              Subtotal: R$ {((item.price || 0) * item.quantity).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-r-none"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                -
              </Button>
              <div className="h-8 w-12 flex items-center justify-center border-y border-gray-200">
                {item.quantity}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-l-none"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
