
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CartEmpty from '@/components/cart/CartEmpty';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CheckoutForm from '@/components/cart/CheckoutForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Cart = () => {
  const { items, removeItem, updateItemQuantity, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  if (items.length === 0 && !isCheckingOut) {
    return (
      <Layout>
        <CartEmpty />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          {isCheckingOut ? 'Finalizar Compra' : 'Seu Carrinho'}
        </h1>
        
        {isCheckingOut ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <CheckoutForm 
                items={items}
                getTotalPrice={getTotalPrice}
                onBackToCart={() => setIsCheckingOut(false)}
                clearCart={clearCart}
              />
            </div>
            
            <div className="md:col-span-1">
              <CartSummary 
                items={items}
                getTotalPrice={getTotalPrice}
                onClearCart={clearCart}
                onCheckout={() => setIsCheckingOut(true)}
                isCheckoutView={true}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateItemQuantity}
                />
              ))}
            </div>
            
            <CartSummary 
              items={items}
              getTotalPrice={getTotalPrice}
              onClearCart={clearCart}
              onCheckout={() => setIsCheckingOut(true)}
            />
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription>
                <p className="text-sm">
                  <strong>Nota:</strong> Cada colaborador pode fazer no máximo 4 pedidos por mês.
                </p>
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
