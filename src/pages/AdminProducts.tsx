
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types/Product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  category: z.enum(['Monitores', 'Periféricos', 'Componentes'], {
    required_error: 'Escolha uma categoria',
  }),
  stock: z.coerce.number().min(0, 'Estoque não pode ser negativo'),
  description: z.string().optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProducts = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'Componentes',
      stock: 0,
      description: '',
      image_url: '',
    },
  });
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });
  
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      form.reset();
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      form.reset();
      setEditingProduct(null);
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      image_url: product.image_url || '',
    });
  };
  
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingProduct(null);
    form.reset();
  };

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar produtos. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciamento de Produtos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estoque</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
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
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                          </FormControl>
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
                              placeholder="Descrição do produto"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      )}
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingProduct 
                          ? (updateMutation.isPending ? 'Salvando...' : 'Atualizar') 
                          : (createMutation.isPending ? 'Salvando...' : 'Salvar')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gag-purple mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando produtos...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhum produto cadastrado.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Estoque</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              {product.stock === 0 ? (
                                <span className="text-red-500 font-medium">Sem estoque</span>
                              ) : product.stock < 3 ? (
                                <span className="text-amber-500 font-medium">Baixo: {product.stock}</span>
                              ) : (
                                <span>{product.stock}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProducts;
