
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
import { 
  getCollaboratorByMatricula, 
  createCollaborator, 
  createOrder, 
  countMonthlyOrders 
} from '@/services/orderService';
import { Trash2, ShoppingBag, AlertTriangle, ChevronLeft, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
  const { items, removeItem, updateItemQuantity, clearCart, getTotalPrice } = useCart();
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
      const existingCollaborator = await getCollaboratorByMatricula(values.matricula);
      
      let collaboratorId;
      
      if (existingCollaborator) {
        collaboratorId = existingCollaborator.id;
        
        // Check monthly order limit
        const orderCount = await countMonthlyOrders(collaboratorId);
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
      const total = getTotalPrice();
      
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
        <div className="max-w-md mx-auto mt-8 text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione algum item para continuar</p>
          <Button onClick={() => navigate('/')} className="bg-blue-700 hover:bg-blue-800">
            <ChevronLeft size={16} className="mr-1" />
            Continuar Comprando
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          {isCheckingOut ? 'Finalizar Compra' : 'Seu Carrinho'}
        </h1>
        
        {isCheckingOut ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCheckingOut(false)}
                className="mb-6"
              >
                <ChevronLeft size={16} className="mr-1" />
                Voltar para o Carrinho
              </Button>
              
              <Card className="mb-6">
                <CardContent className="p-6">
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
                      
                      <div className="pt-4 flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={orderMutation.isPending}
                          className="px-8 bg-blue-700 hover:bg-blue-800"
                        >
                          {orderMutation.isPending ? 'Processando...' : (
                            <>
                              <CreditCard size={16} className="mr-2" />
                              Finalizar Pedido
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="text-sm">
                    <strong>Nota:</strong> Cada colaborador pode fazer no máximo 4 pedidos por mês.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Resumo do Pedido</h3>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium">
                        R$ {((item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold text-lg text-blue-900">
                  <span>Total</span>
                  <span>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-gray-500">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-blue-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Preço unitário: R$ {(item.price || 0).toFixed(2)}
                        </p>
                        <p className="font-medium text-blue-800">
                          Subtotal: R$ {((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-blue-800">Resumo</h3>
                  <p className="text-gray-600">Total de itens: {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-2xl font-bold text-blue-900">R$ {getTotalPrice().toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Continuar Comprando
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => clearCart()}
                  >
                    Limpar Carrinho
                  </Button>
                  <Button 
                    onClick={() => setIsCheckingOut(true)}
                    className="bg-blue-700 hover:bg-blue-800"
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
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
