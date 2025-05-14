
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory, NewProduct } from "@/types/Product";

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }

  // Ensure we cast the data properly to match our Product type
  return (data as unknown) as Product[];
};

export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category);

  if (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product[];
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product;
};

export const createProduct = async (product: NewProduct): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product;
};

export const updateProduct = async (id: string, updates: Partial<NewProduct>): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error(error.message);
  }
};
