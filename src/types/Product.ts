
export type ProductCategory = "Monitores" | "Periféricos" | "Componentes";

export interface CategoryObject {
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  category?: string; // For backward compatibility
  categories?: CategoryObject; // Adding this for the joined data from Supabase
  description: string;
  stock: number;
  price: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface NewProduct {
  name: string;
  category_id: string;
  category?: string; // For backward compatibility
  description: string;
  stock: number;
  price: number;
  image_url?: string;
}

// Tipo para atualizações de produto que torna todos os campos opcionais
export type ProductUpdate = Partial<NewProduct>;
