
export type ProductCategory = "Monitores" | "Periféricos" | "Componentes";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface NewProduct {
  name: string;
  category: ProductCategory;
  description: string;
  stock: number;
  image_url?: string;
}

// Add a new type for product updates that makes all fields optional
export type ProductUpdate = Partial<NewProduct>;
