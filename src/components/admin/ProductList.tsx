
import React from 'react';
import { Product } from '@/types/Product';
import { ProductFormValues } from '@/schemas/productFormSchema';
import ProductsTable from './ProductsTable';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  handleEdit: (product: Product) => void;
  handleDelete: (id: string) => void;
  addMutation: {
    mutate: (values: ProductFormValues) => void;
    isPending: boolean;
  };
  updateMutation: {
    mutate: (data: { id: string; updates: Partial<ProductFormValues> }) => void;
    isPending: boolean;
  };
  onSubmit: (values: ProductFormValues) => void;
}

const ProductList = ({
  products,
  isLoading,
  isAddModalOpen,
  setIsAddModalOpen,
  editingProduct,
  setEditingProduct,
  handleEdit,
  handleDelete,
  addMutation,
  updateMutation,
  onSubmit
}: ProductListProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Produtos</h2>
        
        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          onSubmit={onSubmit}
          isPending={addMutation.isPending}
        />
        
        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={!!editingProduct}
          setIsOpen={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
          onSubmit={onSubmit}
          isPending={updateMutation.isPending}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando produtos...</div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductList;
