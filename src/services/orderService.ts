
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { Collaborator } from "@/types/Collaborator";

interface CollaboratorData {
  name: string;
  matricula: string;
  email: string;
  sector?: string;
  phone?: string;
}

interface OrderData {
  items: CartItem[];
  collaborator: CollaboratorData;
  notes?: string;
  department: string;
}

// Check if the collaborator already exists in the database
export const getCollaboratorByMatricula = async (matricula: string) => {
  const { data, error } = await supabase
    .from("collaborators")
    .select("*")
    .eq("matricula", matricula)
    .single();

  if (error && error.code !== "PGRST116") {  // PGRST116 is "no rows returned"
    console.error("Error fetching collaborator:", error);
    throw new Error(error.message);
  }

  return data as Collaborator | null;
};

// Count orders for a collaborator in the current month
export const countMonthlyOrders = async (collaboratorId: string): Promise<number> => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", collaboratorId)
    .gte("created_at", firstDayOfMonth)
    .lte("created_at", lastDayOfMonth);

  if (error) {
    console.error("Error counting monthly orders:", error);
    throw new Error(error.message);
  }

  return count || 0;
};

// Create a new collaborator
export const createCollaborator = async (collaboratorData: CollaboratorData) => {
  const { data, error } = await supabase
    .from("collaborators")
    .insert(collaboratorData)
    .select()
    .single();

  if (error) {
    console.error("Error creating collaborator:", error);
    throw new Error(error.message);
  }

  return data as Collaborator;
};

// Create a new order
export const createOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  customer_department: string;
  customer_notes?: string;
  total: number;
  user_id: string;
}, cartItems: CartItem[]) => {
  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_department: orderData.customer_department,
      customer_notes: orderData.customer_notes,
      total: orderData.total,
      user_id: orderData.user_id,
      status: "pending"
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error(orderError.message);
  }

  // Add order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price || 0,
    product_name: item.name,
    total: (item.price || 0) * item.quantity
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error adding order items:", itemsError);
    throw new Error(itemsError.message);
  }

  return { orderId: order.id };
};
