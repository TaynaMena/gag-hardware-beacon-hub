
export interface Product {
  id: string;
  name: string;
  category: 'Monitores' | 'Periféricos' | 'Componentes';
  description?: string;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
