
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { getCollaboratorByMatricula, createCollaborator, createOrder, countMonthlyOrders } from '@/services/orderService';
import { toast } from '@/components/ui/sonner';
import { CartItem } from '@/contexts/CartContext';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  matricula: z.string().min(3, 'Matrícula deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  department: z.string().min(2, 'Departamento deve ter pelo menos 2 caracteres'),
  sector: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  items: CartItem[];
  getTotalPrice: () => number;
  onBackToCart: () => void;
  clearCart: () => void;
}

const CheckoutForm = ({ items, getTotalPrice, onBackToCart, clearCart }: CheckoutFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<CheckoutFormValues>({
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
    mutationFn: async (values: CheckoutFormValues) => {
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
      navigate('/');
    },
    onError: (error) => {
      toast.error(`Erro ao finalizar pedido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const onSubmit = (values: CheckoutFormValues) => {
    orderMutation.mutate(values);
  };

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={onBackToCart}
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
  );
};

export default CheckoutForm;
