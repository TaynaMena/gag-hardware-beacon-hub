
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CartEmpty from '@/components/cart/CartEmpty';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const checkoutSchema = z.object({
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const UserCheckout: React.FC = () => {
  const { items, getTotalPrice, removeItem, updateItemQuantity, clearCart } = useCart();
  const { user } = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      notes: '',
    }
  });
  
  const onSubmit = async (values: CheckoutFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar o pedido");
      navigate('/auth?redirectTo=/checkout');
      return;
    }
    
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, verify product stock
      for (const item of items) {
        const { data, error } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
          
        if (error) throw new Error(`Erro ao verificar estoque: ${error.message}`);
        
        if (!data || data.stock < item.quantity) {
          toast.error(`Item ${item.name} não possui estoque suficiente`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create the order
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: user.name,
          customer_email: user.email,
          customer_department: 'Cliente',
          customer_notes: values.notes,
          total: getTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw new Error(`Erro ao criar pedido: ${error.message}`);
      
      // Add order items
      const orderItems = items.map(item => ({
        order_id: data.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price || 0,
        product_name: item.name,
        total: (item.price || 0) * item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw new Error(`Erro ao adicionar itens: ${itemsError.message}`);
      
      // Update product stock - manually update each product's stock
      for (const item of items) {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
          
        if (productError) throw new Error(`Erro ao buscar produto: ${productError.message}`);
        
        const newStock = productData.stock - item.quantity;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
          
        if (updateError) throw new Error(`Erro ao atualizar estoque: ${updateError.message}`);
      }
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Pedido realizado com sucesso!');
      
      // Redirect to order confirmation
      navigate('/colaborador/pedido-confirmado', { 
        state: { orderId: data.id, orderTotal: data.total } 
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao finalizar pedido');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Itens no Carrinho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateItemQuantity}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Nome:</p>
                        <p>{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Email:</p>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Adicione informações adicionais sobre o pedido"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        "Confirmar Pedido"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <CartSummary
              items={items}
              getTotalPrice={getTotalPrice}
              onClearCart={clearCart}
              onCheckout={() => {}}
              isCheckoutView={true}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserCheckout;
