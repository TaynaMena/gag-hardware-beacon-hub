
import { z } from 'zod';
import { ProductCategory } from '@/types/Product';

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.enum(['Monitores', 'Periféricos', 'Componentes'] as const, {
    required_error: "Categoria é obrigatória",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
  image_url: z.string().optional(),
});

// Export both the schema and the inferred type
export type ProductFormData = z.infer<typeof productSchema>;
// Export ProductFormValues as an alias of ProductFormData for backward compatibility
export type ProductFormValues = ProductFormData;
