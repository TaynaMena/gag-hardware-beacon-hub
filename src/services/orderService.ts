
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/Order';
import { Collaborator } from '@/types/Collaborator';
import { CartItem } from '@/contexts/CartContext';

export const createCollaborator = async (collaborator: Collaborator): Promise<Collaborator> => {
  const { data, error } = await supabase
    .from('collaborators')
    .insert(collaborator)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating collaborator:', error);
    throw error;
  }
  
  return data;
};

export const findCollaboratorByMatricula = async (matricula: string): Promise<Collaborator | null> => {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .eq('matricula', matricula)
    .maybeSingle();
  
  if (error) {
    console.error('Error finding collaborator:', error);
    throw error;
  }
  
  return data;
};

export const createOrder = async (
  orderData: Order,
  items: CartItem[]
): Promise<{ order: Order; orderItems: OrderItem[] }> => {
  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }
  
  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price || 0,
    total: (item.price || 0) * item.quantity
  }));
  
  const { data: createdOrderItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw itemsError;
  }
  
  return { 
    order, 
    orderItems: createdOrderItems 
  };
};

export const getOrdersByCollaboratorId = async (collaboratorId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('collaborator_id', collaboratorId);
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
  
  return data || [];
};

export const countOrdersThisMonth = async (collaboratorId: string): Promise<number> => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('collaborator_id', collaboratorId)
    .gte('created_at', startOfMonth.toISOString());
  
  if (error) {
    console.error('Error counting orders this month:', error);
    throw error;
  }
  
  return count || 0;
};
