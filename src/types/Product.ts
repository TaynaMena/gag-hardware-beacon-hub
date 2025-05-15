
export type ProductCategory = "Monitores" | "Periféricos" | "Componentes";

export interface Product {
  id: string;
  name: string;
  category_id: string;
  category?: string; // Adding back for backward compatibility
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
  category?: string; // Adding back for backward compatibility
  description: string;
  stock: number;
  price: number;
  image_url?: string;
}

// Tipo para atualizações de produto que torna todos os campos opcionais
export type ProductUpdate = Partial<NewProduct>;
