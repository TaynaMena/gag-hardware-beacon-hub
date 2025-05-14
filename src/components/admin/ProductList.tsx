
import React from 'react';
import { Product } from '@/types/Product';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ProductForm, { ProductFormValues } from './ProductForm';

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
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Adicionar Produto</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm
              isSubmitting={addMutation.isPending}
              submitButtonText={addMutation.isPending ? 'Salvando...' : 'Salvar Produto'}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                defaultValues={{
                  name: editingProduct.name,
                  category: editingProduct.category,
                  description: editingProduct.description || '',
                  stock: editingProduct.stock,
                  price: editingProduct.price || 0,
                  image_url: editingProduct.image_url || ''
                }}
                isSubmitting={updateMutation.isPending}
                submitButtonText={updateMutation.isPending ? 'Atualizando...' : 'Atualizar Produto'}
                onSubmit={onSubmit}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Carregando produtos...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-gray-500">
                              Sem img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className="font-medium text-blue-900">
                        R$ {product.price ? product.price.toFixed(2) : '0.00'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-red-600 font-medium" : ""}>
                        {product.stock} unidades
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
