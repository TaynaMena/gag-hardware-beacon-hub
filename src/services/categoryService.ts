
import { supabase } from "@/integrations/supabase/client";
import { Category, NewCategory, CategoryUpdate } from "@/types/Category";

export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }

  return data as Category[];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Category;
};

export const createCategory = async (category: NewCategory): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error(error.message);
  }

  return data as Category;
};

export const updateCategory = async (id: string, updates: CategoryUpdate): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw new Error(error.message);
  }
};

// Função para gerar slug a partir do nome da categoria
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
