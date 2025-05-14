
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CartEmpty = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-8 text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
      <p className="text-gray-600 mb-6">Adicione algum item para continuar</p>
      <Button onClick={() => navigate('/')} className="bg-blue-700 hover:bg-blue-800">
        <ChevronLeft size={16} className="mr-1" />
        Continuar Comprando
      </Button>
    </div>
  );
};

export default CartEmpty;
