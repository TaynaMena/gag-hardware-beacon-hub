
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

  // Transform the data to include category name for backward compatibility
  const productsWithCategory = data.map(item => ({
    ...item,
    category: item.category || item.categories?.name || "Sem categoria"
  }));

  return productsWithCategory as Product[];
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

  // Transform the data to include category name for backward compatibility
  const productsWithCategory = data.map(item => ({
    ...item,
    category: item.category || item.categories?.name || "Sem categoria"
  }));

  return productsWithCategory as Product[];
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

  // Add category field for backward compatibility
  const productWithCategory = {
    ...data,
    category: data.category || data.categories?.name || "Sem categoria"
  };

  return productWithCategory as Product;
};

export const createProduct = async (product: NewProduct): Promise<Product> => {
  // Ensure we have both category and category_id for backward compatibility
  const productData = { 
    ...product,
    category: product.category || "Sem categoria" // Ensure category is present for database
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  return data as Product;
};

export const updateProduct = async (id: string, updates: ProductUpdate): Promise<Product> => {
  // Ensure backward compatibility for category field
  const updatesWithCategory = { ...updates };
  
  const { data, error } = await supabase
    .from("products")
    .update(updatesWithCategory)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Product;
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
      // Ensure we pass both category and category_id
      const productToCreate = {
        ...products[i],
        category: products[i].category || "Sem categoria", // Ensure category is present for database
        image_url: undefined
      };
      
      await createProduct(productToCreate);
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
