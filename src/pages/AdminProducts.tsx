
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Pencil, Trash2, Plus, Package, ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { ProductCategory } from '@/types/Product';

// Form schema for adding/editing products
const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  category: z.enum(['Monitores', 'Periféricos', 'Componentes'] as const),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  stock: z.coerce.number().min(0, 'A quantidade em estoque não pode ser negativa'),
  image_url: z.string().optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

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
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  // Get all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });
  
  // Product form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'Componentes',
      description: '',
      stock: 0,
      image_url: ''
    }
  });
  
  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isAddModalOpen && !editingProduct) {
      form.reset({
        name: '',
        category: 'Componentes',
        description: '',
        stock: 0,
        image_url: ''
      });
    } else if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        category: editingProduct.category as ProductCategory,
        description: editingProduct.description || '',
        stock: editingProduct.stock,
        image_url: editingProduct.image_url || ''
      });
    }
  }, [isAddModalOpen, editingProduct, form]);
  
  // Add new product
  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto adicionado com sucesso!');
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Update product
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      updateProduct(id, updates),
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
  
  const handleEdit = (product: any) => {
    setEditingProduct(product);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Aguardando</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Processando</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Entregue</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
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
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Produto</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do produto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Monitores">Monitores</SelectItem>
                                  <SelectItem value="Periféricos">Periféricos</SelectItem>
                                  <SelectItem value="Componentes">Componentes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descrição detalhada do produto" 
                                  rows={3} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estoque</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL da Imagem (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={addMutation.isPending}
                          >
                            {addMutation.isPending ? 'Salvando...' : 'Salvar Produto'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                {/* Edit Product Dialog */}
                <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Produto</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do produto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Monitores">Monitores</SelectItem>
                                  <SelectItem value="Periféricos">Periféricos</SelectItem>
                                  <SelectItem value="Componentes">Componentes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descrição detalhada do produto" 
                                  rows={3} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estoque</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL da Imagem (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? 'Atualizando...' : 'Atualizar Produto'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
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
                        <TableHead>Estoque</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
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
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Pedidos Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado</div>
                  ) : (
                    <div className="space-y-6">
                      {mockOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{order.customer_name}</h4>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-sm text-gray-600">
                                Pedido #{order.id.substring(0, 6)} • {new Date(order.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 mt-3 pt-3">
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{item.product_name} x {item.quantity}</span>
                                  <span>R$ {item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-1 text-sm">
                              {getStatusIcon(order.status)}
                              <span>{order.status === 'pending' ? 'Aguardando processamento' : 
                                    order.status === 'processing' ? 'Em processamento' : 
                                    'Entregue'}</span>
                            </div>
                            <Button size="sm" variant="outline">
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminProducts;
