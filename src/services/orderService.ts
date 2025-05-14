
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

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

  return data;
};

// Count orders for a collaborator in the current month
export const countMonthlyOrders = async (collaboratorId: string): Promise<number> => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("collaborator_id", collaboratorId)
    .gte("created_at", firstDayOfMonth)
    .lte("created_at", lastDayOfMonth);

  if (error) {
    console.error("Error counting monthly orders:", error);
    throw new Error(error.message);
  }

  return count || 0;
};

// Create a new order
export const createOrder = async (orderData: OrderData) => {
  // Start a transaction
  // First, check if collaborator exists or create one
  let collaboratorId;
  const existingCollaborator = await getCollaboratorByMatricula(orderData.collaborator.matricula);

  if (existingCollaborator) {
    collaboratorId = existingCollaborator.id;
    
    // Check monthly order limit
    const orderCount = await countMonthlyOrders(collaboratorId);
    if (orderCount >= 4) {
      throw new Error("Limite de 4 pedidos por mês excedido para este colaborador.");
    }
  } else {
    // Create a new collaborator
    const { data: newCollaborator, error: collaboratorError } = await supabase
      .from("collaborators")
      .insert(orderData.collaborator)
      .select()
      .single();

    if (collaboratorError) {
      console.error("Error creating collaborator:", collaboratorError);
      throw new Error(collaboratorError.message);
    }

    collaboratorId = newCollaborator.id;
  }

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      collaborator_id: collaboratorId,
      status: "pending"
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error(orderError.message);
  }

  // Add order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity
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
