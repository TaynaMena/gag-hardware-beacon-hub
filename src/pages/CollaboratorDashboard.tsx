
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, ShoppingBag, User, Clock } from 'lucide-react';
import { useCollaboratorAuth } from '@/contexts/CollaboratorAuthContext';
import { ProductList } from '@/components/CollaboratorProductList';
import { Product } from '@/types/Product';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

const CollaboratorDashboard: React.FC = () => {
  const { collaborator, monthlyOrderCount, monthlyCap, logout } = useCollaboratorAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!collaborator?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', collaborator.id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setRecentOrders(data || []);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentOrders();
  }, [collaborator?.id]);

  // Calculate progress percentage
  const orderProgress = (monthlyOrderCount / monthlyCap) * 100;
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Bem-vindo, {collaborator?.name}</h1>
            <p className="text-gray-600">Matrícula: {collaborator?.matricula} | Setor: {collaborator?.sector || 'Não especificado'}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="mr-2" onClick={() => navigate('/colaborador/pedidos')}>
              <Package className="mr-2 h-4 w-4" />
              Meus Pedidos
            </Button>
            <Button variant="outline" onClick={logout}>
              <User className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
        
        {/* Order Limit Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> 
              Limite de Compras Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {monthlyOrderCount} de {monthlyCap} pedidos utilizados este mês
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {monthlyCap - monthlyOrderCount} restantes
                </span>
              </div>
              <Progress value={orderProgress} className="h-2" />
            </div>
            <div className="mt-4">
              {monthlyOrderCount >= monthlyCap ? (
                <Badge variant="destructive" className="text-sm">
                  Limite mensal atingido
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm">
                  {monthlyCap - monthlyOrderCount} pedidos disponíveis
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Product List Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Disponíveis</CardTitle>
              <CardDescription>
                Escolha entre nosso catálogo de produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductList />
            </CardContent>
          </Card>
          
          {/* Recent Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Pedidos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Carregando pedidos...</p>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Pedido #{order.id.slice(-5)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                          {order.status === 'pending' ? 'Pendente' : 
                           order.status === 'completed' ? 'Concluído' : 
                           order.status === 'canceled' ? 'Cancelado' : order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum pedido recente encontrado.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/colaborador/pedidos')}>
                Ver todos os pedidos <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CollaboratorDashboard;
