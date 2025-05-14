
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Product, ProductCategory } from '@/types/Product';
import { getAllProducts, getProductsByCategory } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';

const Banner = () => (
  <div className="w-full bg-blue-700 rounded-lg shadow-lg p-8 md:p-12 mb-12">
    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
      Ofertas especiais para colaboradores GAG
    </h1>
    <p className="text-blue-200 text-xl md:text-2xl mb-6">
      Aproveite descontos exclusivos em produtos de hardware. Monitores, teclados, mouses e muito mais com preços especiais para você!
    </p>
    <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
      Ver ofertas
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative">
        {product.stock > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className={isLowStock ? "bg-amber-400" : "bg-green-500"}>
              {product.stock} em estoque
            </Badge>
          </div>
        )}
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
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "outline" : "default"}
          className="w-full mt-2"
        >
          {isOutOfStock ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

const CategoryButton = ({ 
  category, 
  activeCategory, 
  onClick 
}: { 
  category: string; 
  activeCategory: string; 
  onClick: () => void;
}) => (
  <Button
    variant={activeCategory === category ? "default" : "outline"}
    onClick={onClick}
    className={`w-full ${activeCategory === category ? "bg-blue-700" : ""}`}
  >
    {category}
  </Button>
);

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
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Categorias</h2>
          <div className="flex flex-col space-y-2">
            <CategoryButton 
              category="Todos" 
              activeCategory={activeCategory} 
              onClick={() => setActiveCategory('Todos')} 
            />
            <CategoryButton 
              category="Monitores" 
              activeCategory={activeCategory} 
              onClick={() => setActiveCategory('Monitores')} 
            />
            <CategoryButton 
              category="Periféricos" 
              activeCategory={activeCategory} 
              onClick={() => setActiveCategory('Periféricos')} 
            />
            <CategoryButton 
              category="Componentes" 
              activeCategory={activeCategory} 
              onClick={() => setActiveCategory('Componentes')} 
            />
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            {activeCategory === 'Todos' ? 'Todos os Produtos' : activeCategory}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando produtos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
