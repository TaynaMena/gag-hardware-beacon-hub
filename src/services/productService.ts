
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/Product';

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data || [];
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    throw error;
  }
  
  return data || [];
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};
