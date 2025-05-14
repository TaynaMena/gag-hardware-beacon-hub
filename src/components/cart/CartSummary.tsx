
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/contexts/CartContext';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  items: CartItem[];
  getTotalPrice: () => number;
  onClearCart: () => void;
  onCheckout: () => void;
  isCheckoutView?: boolean;
}

const CartSummary = ({ 
  items, 
  getTotalPrice, 
  onClearCart, 
  onCheckout, 
  isCheckoutView = false 
}: CartSummaryProps) => {
  const navigate = useNavigate();

  if (isCheckoutView) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
        <h3 className="text-xl font-bold mb-4 text-blue-800">Resumo do Pedido</h3>
        <div className="space-y-3 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-medium">
                R$ {((item.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between font-bold text-lg text-blue-900">
          <span>Total</span>
          <span>R$ {getTotalPrice().toFixed(2)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-blue-800">Resumo</h3>
          <p className="text-gray-600">Total de itens: {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-2xl font-bold text-blue-900">R$ {getTotalPrice().toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Continuar Comprando
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="destructive" 
            onClick={onClearCart}
          >
            Limpar Carrinho
          </Button>
          <Button 
            onClick={onCheckout}
            className="bg-blue-700 hover:bg-blue-800"
          >
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
