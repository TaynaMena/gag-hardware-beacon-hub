
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

// Define the order interface
interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
}

const OrderList = ({ orders }: OrderListProps) => {
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
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span>Pedidos Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
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
  );
};

export default OrderList;
