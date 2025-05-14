
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Package, Eye } from 'lucide-react';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  total: number;
  status: string;
  items?: OrderItem[];
}

const CollaboratorOrders: React.FC = () => {
  const { collaborator } = useCollaboratorAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!collaborator?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', collaborator.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [collaborator?.id]);
  
  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
        
      if (error) throw error;
      setOrderItems(data || []);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pendente</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Meus Pedidos</h1>
          <Button variant="outline" onClick={() => navigate('/colaborador')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Carregando pedidos...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 md:p-6 grid md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-700" />
                        <div>
                          <p className="font-semibold text-blue-900">Pedido #{order.id.slice(-5)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">R$ {order.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Você ainda não fez nenhum pedido</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 mb-4">Confira nosso catálogo e faça seu primeiro pedido!</p>
              <Button onClick={() => navigate('/colaborador')}>
                Ver produtos disponíveis
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Order Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{selectedOrder?.id.slice(-5)}</DialogTitle>
              <DialogDescription>
                Realizado em {selectedOrder ? formatDate(selectedOrder.created_at) : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {selectedOrder ? getStatusBadge(selectedOrder.status) : ''}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-gray-500">Qtd: {item.quantity} × R$ {item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-bold">R$ {item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>R$ {selectedOrder?.total.toFixed(2)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CollaboratorOrders;
