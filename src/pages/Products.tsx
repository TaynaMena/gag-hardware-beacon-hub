
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Monitor, Keyboard, Cpu, ShoppingBag, Search } from 'lucide-react';
import { Product } from '@/types/Product';
import { getAllProducts } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/sonner';

const CategoryButton = ({ 
  category, 
  activeCategory, 
  onClick,
  icon
}: { 
  category: string; 
  activeCategory: string; 
  onClick: () => void;
  icon?: React.ReactNode;
}) => (
  <Button
    variant={activeCategory === category ? "default" : "outline"}
    onClick={onClick}
    className={`w-full flex items-center justify-start gap-2 ${
      activeCategory === category 
        ? "bg-gag-blue text-gag-white hover:bg-gag-blue-dark" 
        : "border-gag-cyan/40 text-gag-white hover:bg-gag-cyan/10 hover:text-gag-cyan"
    }`}
  >
    {icon}
    <span>{category}</span>
  </Button>
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
      price: product.price,
      quantity: 1,
      image_url: product.image_url
    });
    
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-md border border-gag-cyan/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gag-cyan/50">
      <div className="relative">
        {product.stock > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className={`${isLowStock ? "bg-amber-400 text-gag-dark" : "bg-gag-lime text-gag-dark"} shadow-sm`}>
              {product.stock} em estoque
            </Badge>
          </div>
        )}
        <div className="h-48 bg-black/60 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/40 text-gray-400">
              <ShoppingBag size={48} />
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-gag-cyan">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gag-white">
            R$ {product.price ? product.price.toFixed(2) : '0.00'}
          </span>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "outline" : "default"}
          className={`w-full ${isOutOfStock ? "border-red-400 text-red-400" : "bg-gag-blue hover:bg-gag-blue-dark"}`}
        >
          {isOutOfStock ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });

  const filteredProducts = allProducts
    .filter(product => {
      // Filtro de categoria
      if (activeCategory !== 'Todos') {
        const productCategory = product.category || 
                              (product.categories?.name ? product.categories.name : 'Sem categoria');
        if (productCategory !== activeCategory) return false;
      }
      
      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    });

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
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gag-cyan mb-6">Produtos</h1>
        
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full bg-black/40 border border-gag-cyan/30 rounded-lg px-4 py-2 text-gag-white placeholder:text-gray-400 focus:outline-none focus:border-gag-cyan pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gag-cyan" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-black/40 backdrop-blur-md p-5 rounded-lg border border-gag-cyan/30 sticky top-24">
              <h2 className="text-2xl font-bold text-gag-white mb-4">Categorias</h2>
              <div className="flex flex-col space-y-2">
                <CategoryButton 
                  category="Todos" 
                  activeCategory={activeCategory} 
                  onClick={() => setActiveCategory('Todos')} 
                  icon={<ShoppingBag size={18} />}
                />
                <CategoryButton 
                  category="Monitores" 
                  activeCategory={activeCategory} 
                  onClick={() => setActiveCategory('Monitores')} 
                  icon={<Monitor size={18} />}
                />
                <CategoryButton 
                  category="Periféricos" 
                  activeCategory={activeCategory} 
                  onClick={() => setActiveCategory('Periféricos')} 
                  icon={<Keyboard size={18} />}
                />
                <CategoryButton 
                  category="Componentes" 
                  activeCategory={activeCategory} 
                  onClick={() => setActiveCategory('Componentes')} 
                  icon={<Cpu size={18} />}
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gag-white mb-6">
              {activeCategory === 'Todos' ? 'Todos os Produtos' : activeCategory}
              {searchQuery && <span className="text-gag-lime"> - Resultados para "{searchQuery}"</span>}
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gag-cyan mx-auto"></div>
                <p className="mt-4 text-gray-300">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-lg border border-gag-cyan/20">
                <ShoppingBag size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-300">Nenhum produto encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
