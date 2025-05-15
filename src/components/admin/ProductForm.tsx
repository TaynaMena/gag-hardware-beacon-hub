
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProductFormValues } from '@/schemas/productFormSchema';

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitButtonText
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: ProductFormValues = {
      name: formData.get('name') as string,
      category_id: formData.get('category_id') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      image_url: formData.get('image_url') as string
    };
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do produto</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={defaultValues?.name}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={defaultValues?.category_id}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Monitores">Monitores</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Hardware">Hardware</option>
              <option value="Componentes">Componentes</option>
              <option value="Acessórios">Acessórios</option>
            </select>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={defaultValues?.stock}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={defaultValues?.price}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={defaultValues?.description}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input
              id="image_url"
              name="image_url"
              type="text"
              defaultValue={defaultValues?.image_url}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
