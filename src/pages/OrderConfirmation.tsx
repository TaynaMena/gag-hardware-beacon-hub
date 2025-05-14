
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShoppingBag, Truck } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderTotal } = location.state || {};
  
  // If no order data was passed, redirect to dashboard
  useEffect(() => {
    if (!orderId) {
      navigate('/colaborador');
    }
  }, [orderId, navigate]);
  
  if (!orderId) {
    return null; // Will redirect from useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-2xl">
        <Card className="text-center overflow-hidden">
          <CardHeader className="bg-green-50 pb-10">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
            </div>
            <CardTitle className="text-2xl text-green-700">Pedido Confirmado!</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-8">
            <div className="space-y-6">
              <div>
                <p className="text-gray-500">Número do Pedido</p>
                <p className="text-xl font-semibold">#{orderId.slice(-5)}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-xl font-semibold">R$ {orderTotal.toFixed(2)}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md text-blue-800 flex flex-col items-center">
                <Truck className="h-6 w-6 mb-2" />
                <p className="font-medium">O vendedor entrará em contato para a entrega!</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/colaborador/pedidos')}
            >
              Ver meus pedidos
            </Button>
            <Button 
              onClick={() => navigate('/colaborador')}
              className="flex items-center"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuar comprando
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
