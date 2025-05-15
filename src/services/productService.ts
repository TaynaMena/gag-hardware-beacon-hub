
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory, NewProduct, ProductUpdate } from "@/types/Product";

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories:category_id(name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product[];
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories:category_id(name, slug)")
    .eq("category_id", categoryId);

  if (error) {
    console.error(`Error fetching products in category ${categoryId}:`, error);
    throw new Error(error.message);
  }

  return (data as unknown) as Product[];
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories:category_id(name, slug)")
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

export const updateProduct = async (id: string, updates: ProductUpdate): Promise<Product> => {
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

export const importProductsFromJSON = async (products: Omit<NewProduct, 'image_url'>[]): Promise<{success: number, errors: {index: number, error: string}[]}> => {
  const results = {
    success: 0,
    errors: [] as {index: number, error: string}[]
  };

  for (let i = 0; i < products.length; i++) {
    try {
      await createProduct({
        ...products[i],
        image_url: undefined
      });
      results.success++;
    } catch (error) {
      results.errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  return results;
};
