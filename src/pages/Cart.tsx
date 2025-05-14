
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CartEmpty from '@/components/cart/CartEmpty';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, removeItem, updateItemQuantity, clearCart, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // Redirect to the collaborator checkout
    navigate('/colaborador/checkout');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <CartEmpty />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Seu Carrinho</h1>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
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
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </div>
    </Layout>
  );
};

export default Cart;
