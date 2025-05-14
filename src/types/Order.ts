
export interface Order {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_department: string;
  customer_notes?: string;
  status?: string;
  total: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  created_at?: string;
}
