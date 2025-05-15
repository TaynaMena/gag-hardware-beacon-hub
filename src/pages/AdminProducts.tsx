import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSellerAuth } from '@/contexts/SellerAuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Edit, Trash2, PackagePlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Product } from '@/types/Product';

const AdminProducts = () => {
  const { isAuthenticated } = useSellerAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Query products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories:category_id(name, slug)')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(`Erro ao carregar produtos: ${error.message}`);
        throw error;
      }
      
      // Add category field for backward compatibility
      const productsWithCategory = data.map(item => ({
        ...item,
        category: item.category || item.categories?.name || "Sem categoria"
      }));
      
      return productsWithCategory as Product[];
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    },
  });

  const handleEditProduct = (id: string) => {
    navigate(`/admin/editar-produto/${id}`);
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Produtos</h1>
          <Button
            onClick={() => navigate('/admin/cadastrar-produto')}
            className="mt-4 md:mt-0"
          >
            <PackagePlus className="mr-2 h-4 w-4" /> Cadastrar Produto
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="bg-white rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <PackagePlus size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categories?.name || product.category || "Sem categoria"}</TableCell>
                    <TableCell>
                      <StockBadge stock={product.stock} />
                    </TableCell>
                    <TableCell>
                      R$ {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-12 border rounded-md bg-white">
            <PackagePlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-500 mb-6">
              Cadastre produtos para que os colaboradores possam comprá-los.
            </p>
            <Button onClick={() => navigate('/admin/cadastrar-produto')}>
              <PackagePlus className="mr-2 h-4 w-4" /> Cadastrar Produto
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

// Helper component for stock display
interface StockBadgeProps {
  stock: number;
}

const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock === 0) {
    return <Badge variant="destructive">Sem estoque</Badge>;
  } else if (stock < 5) {
    return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Baixo: {stock}</Badge>;
  } else {
    return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Em estoque: {stock}</Badge>;
  }
};

export default AdminProducts;
