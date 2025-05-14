
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Package } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product, NewProduct, ProductUpdate } from '@/types/Product';
import ProductList from '@/components/admin/ProductList';
import OrderList from '@/components/admin/OrderList';
import { ProductFormValues } from '@/components/admin/ProductForm';

// Mock order data until we implement the real service
const mockOrders = [
  { 
    id: '1', 
    customer_name: 'João Silva', 
    created_at: '2025-05-10T10:00:00Z', 
    status: 'pending', 
    total: 1200.90,
    items: [
      { product_name: 'Monitor Dell 27"', quantity: 1, price: 1200.90 }
    ]
  },
  { 
    id: '2', 
    customer_name: 'Maria Santos', 
    created_at: '2025-05-09T16:30:00Z', 
    status: 'processing', 
    total: 2450.50,
    items: [
      { product_name: 'Teclado Mecânico', quantity: 1, price: 450.50 },
      { product_name: 'Placa de Vídeo RTX 4060', quantity: 1, price: 2000.00 }
    ]
  },
  { 
    id: '3', 
    customer_name: 'Carlos Oliveira', 
    created_at: '2025-05-08T09:15:00Z', 
    status: 'completed', 
    total: 3500.00,
    items: [
      { product_name: 'Kit Upgrade (CPU + Placa-mãe)', quantity: 1, price: 3500.00 }
    ]
  },
];

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Get all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });
  
  // Add new product
  const addMutation = useMutation({
    mutationFn: (values: ProductFormValues): Promise<any> => {
      // Criar um objeto que corresponda ao tipo NewProduct
      const newProduct: NewProduct = {
        name: values.name,
        category: values.category,
        description: values.description,
        stock: values.stock,
        price: values.price,
        image_url: values.image_url
      };
      return createProduct(newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto adicionado com sucesso!');
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Update product using the ProductUpdate type
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ProductFormValues> }) => {
      // Criar um objeto que corresponda ao tipo ProductUpdate (que é um Partial<NewProduct>)
      const productUpdates: ProductUpdate = {};
      
      if (updates.name !== undefined) productUpdates.name = updates.name;
      if (updates.category !== undefined) productUpdates.category = updates.category;
      if (updates.description !== undefined) productUpdates.description = updates.description;
      if (updates.stock !== undefined) productUpdates.stock = updates.stock;
      if (updates.price !== undefined) productUpdates.price = updates.price;
      if (updates.image_url !== undefined) productUpdates.image_url = updates.image_url;
      
      return updateProduct(id, productUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto atualizado com sucesso!');
      setEditingProduct(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Delete product
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        updates: values
      });
    } else {
      addMutation.mutate(values);
    }
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Painel de Administração</h1>
        </div>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Produtos</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductList
              products={products}
              isLoading={isLoading}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              addMutation={addMutation}
              updateMutation={updateMutation}
              onSubmit={onSubmit}
            />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderList orders={mockOrders} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminProducts;
