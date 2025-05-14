
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Product } from '@/types/Product';
import { getAllProducts, getProductsByCategory } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Banner = () => (
  <div className="w-full bg-gradient-to-r from-gag-blue to-gag-cyan rounded-lg shadow-lg p-8 md:p-12 mb-12">
    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
      GAG Hardware Hub
    </h1>
    <p className="text-white/90 text-xl md:text-2xl mb-6">
      Sua fonte confiável de componentes de hardware de alta qualidade
    </p>
    <Button size="lg" className="bg-white text-gag-blue hover:bg-gray-100">
      Explore Nossa Coleção
    </Button>
  </div>
);

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const isLowStock = product.stock > 0 && product.stock < 3;
  const isOutOfStock = product.stock === 0;
  
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Este produto está fora de estoque');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      quantity: 1,
      image_url: product.image_url
    });
    
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  
  return (
    <div className="hardware-card flex flex-col h-full">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-2 mt-auto">
          <div>
            {isOutOfStock ? (
              <Badge variant="destructive">Sem Estoque</Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                Estoque Baixo: {product.stock}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-gag-green text-gag-green">
                Em Estoque: {product.stock}
              </Badge>
            )}
          </div>
          <span className="text-sm text-gag-purple font-medium">{product.category}</span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "outline" : "default"}
          className="mt-2 w-full"
        >
          {isOutOfStock ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });

  const filteredProducts = activeCategory === 'Todos' 
    ? allProducts 
    : allProducts.filter(product => product.category === activeCategory);

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
      <Banner />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Nossos Produtos</h2>
        
        <Tabs defaultValue="Todos" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8">
            <TabsTrigger value="Todos">Todos</TabsTrigger>
            <TabsTrigger value="Monitores">Monitores</TabsTrigger>
            <TabsTrigger value="Periféricos">Periféricos</TabsTrigger>
            <TabsTrigger value="Componentes">Componentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gag-purple mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="hardware-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Home;
