
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createCollaborator, findCollaboratorByMatricula, createOrder, countOrdersThisMonth } from '@/services/orderService';
import { Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  matricula: z.string().min(3, 'Matrícula deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  department: z.string().min(2, 'Departamento deve ter pelo menos 2 caracteres'),
  sector: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Cart = () => {
  const { items, removeItem, updateItemQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      matricula: '',
      email: '',
      department: '',
      sector: '',
      phone: '',
      notes: '',
    },
  });
  
  const orderMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Check if collaborator exists by matricula
      const existingCollaborator = await findCollaboratorByMatricula(values.matricula);
      
      let collaboratorId;
      
      if (existingCollaborator) {
        collaboratorId = existingCollaborator.id;
        
        // Check monthly order limit
        const orderCount = await countOrdersThisMonth(collaboratorId);
        if (orderCount >= 4) {
          throw new Error("Limite de 4 pedidos por mês excedido para este colaborador.");
        }
      } else {
        // Create new collaborator
        const newCollaborator = await createCollaborator({
          name: values.name,
          matricula: values.matricula,
          email: values.email,
          sector: values.sector,
          phone: values.phone,
        });
        collaboratorId = newCollaborator.id;
      }
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
      
      // Create order
      return await createOrder(
        {
          customer_name: values.name,
          customer_email: values.email,
          customer_department: values.department,
          customer_notes: values.notes,
          total,
          user_id: collaboratorId || '',
        },
        items
      );
    },
    onSuccess: () => {
      toast.success('Pedido realizado com sucesso!');
      clearCart();
      setIsCheckingOut(false);
      navigate('/');
    },
    onError: (error) => {
      toast.error(`Erro ao finalizar pedido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const onSubmit = (values: FormValues) => {
    orderMutation.mutate(values);
  };
  
  if (items.length === 0 && !isCheckingOut) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-8 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione algum item para continuar</p>
          <Button onClick={() => navigate('/')}>Continuar Comprando</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
        
        {isCheckingOut ? (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setIsCheckingOut(false)}
              className="mb-6"
            >
              Voltar para o Carrinho
            </Button>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="matricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua matrícula" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail Corporativo</FormLabel>
                        <FormControl>
                          <Input placeholder="seu.email@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu departamento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setor (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu setor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Adicione qualquer informação adicional sobre seu pedido" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-bold mb-2">Resumo do Pedido</h3>
                  <ul className="space-y-2 mb-4">
                    {items.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-bold">
                    Total de itens: {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsCheckingOut(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={orderMutation.isPending}
                    className="px-8"
                  >
                    {orderMutation.isPending ? 'Processando...' : 'Finalizar Pedido'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4">
                      <div className="w-16 h-16 bg-gray-100 rounded mr-4 flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-gray-500">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <div className="h-8 w-12 flex items-center justify-center border-y border-gray-200">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Continuar Comprando
              </Button>
              
              <div>
                <Button variant="destructive" onClick={() => clearCart()} className="mr-2">
                  Limpar Carrinho
                </Button>
                <Button onClick={() => setIsCheckingOut(true)}>
                  Finalizar Pedido
                </Button>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 mt-4">
              <AlertDescription>
                <p className="text-sm">
                  <strong>Nota:</strong> Cada colaborador pode fazer no máximo 4 pedidos por mês.
                </p>
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
