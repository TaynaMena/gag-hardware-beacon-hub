import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { getAllProducts } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/sonner';
import { 
  Grid2X2, 
  LayoutList, 
  Package, 
  ShoppingBag, 
  Star, 
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ProductCard Component
const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
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
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-gag-cyan/30 overflow-hidden h-full flex flex-col transition-all hover:shadow-[0_0_15px_rgba(21,241,255,0.3)] hover:border-gag-cyan/60">
      <div className="relative h-48 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/60">
            <Package className="w-12 h-12 text-gag-cyan/50" />
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge className={isOutOfStock 
            ? "bg-red-500/80 text-white" 
            : "bg-gag-lime text-gag-dark"
          }>
            {isOutOfStock ? 'Fora de Estoque' : `${product.stock} em estoque`}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="border-gag-cyan/40 text-gag-cyan text-xs">
            {product.categories?.name || product.category || "Sem categoria"}
          </Badge>
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-300 ml-1">4.5</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gag-white mb-1 line-clamp-1">{product.name}</h3>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">
          {product.description || "Sem descrição disponível"}
        </p>
        
        <div className="flex items-end justify-between mt-auto">
          <span className="text-xl font-bold text-gag-cyan">
            R$ {product.price.toFixed(2)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="sm"
            className={cn(
              "flex items-center gap-1",
              isOutOfStock 
                ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed" 
                : "bg-gag-blue hover:bg-gag-blue-dark"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main ProductShowcase Page
const ProductShowcase = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });
  
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });
  
  const filteredProducts = selectedCategory 
    ? products.filter(product => 
        product.category_id === selectedCategory || 
        (product.categories?.slug && product.categories.slug === selectedCategory)
      )
    : products;
    
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Categories Sidebar */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-black/40 backdrop-blur-sm border border-gag-cyan/30 rounded-lg p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gag-white">Categorias</h2>
                <Package className="text-gag-cyan" />
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full justify-start gap-2 border-gag-cyan/30 text-gag-white",
                    selectedCategory === null ? "bg-gag-blue border-transparent" : "bg-transparent"
                  )}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Todos os Produtos
                </Button>
                
                {categoriesLoading ? (
                  <div className="py-4 px-2">
                    <div className="h-8 bg-gray-800/50 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-800/50 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-800/50 rounded animate-pulse"></div>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full justify-start gap-2 border-gag-cyan/30 text-gag-white",
                        selectedCategory === category.id ? "bg-gag-blue border-transparent" : "bg-transparent"
                      )}
                    >
                      <Package className="w-4 h-4" />
                      {category.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-400 py-2">Nenhuma categoria encontrada</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Products Content */}
          <div className="flex-grow w-full">
            <div className="bg-black/30 backdrop-blur-sm border border-gag-cyan/20 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gag-white">
                  {selectedCategory 
                    ? categories.find(c => c.id === selectedCategory)?.name || "Categoria" 
                    : "Todos os Produtos"}
                </h1>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Visualização:</span>
                  <div className="flex bg-black/40 rounded-md border border-gag-cyan/30">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "px-3 rounded-none rounded-l-md",
                        viewMode === 'grid' ? "bg-gag-blue text-white" : "text-gray-400"
                      )}
                    >
                      <Grid2X2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "px-3 rounded-none rounded-r-md",
                        viewMode === 'list' ? "bg-gag-blue text-white" : "text-gray-400"
                      )}
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-gag-cyan/20 overflow-hidden h-[340px]">
                    <div className="h-48 bg-gray-800/50 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-800/50 rounded animate-pulse mb-2 w-1/3"></div>
                      <div className="h-6 bg-gray-800/50 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-800/50 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-800/50 rounded animate-pulse mb-2 w-2/3"></div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-6 bg-gray-800/50 rounded animate-pulse w-1/4"></div>
                        <div className="h-8 bg-gray-800/50 rounded animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-4"}
              >
                {filteredProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <div key={product.id} className="bg-black/40 backdrop-blur-sm rounded-lg border border-gag-cyan/30 overflow-hidden transition-all hover:border-gag-cyan/60">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-48">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/60">
                              <Package className="w-12 h-12 text-gag-cyan/50" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="border-gag-cyan/40 text-gag-cyan">
                              {product.categories?.name || product.category || "Sem categoria"}
                            </Badge>
                            <Badge className={product.stock === 0 
                              ? "bg-red-500/80 text-white" 
                              : "bg-gag-lime text-gag-dark"
                            }>
                              {product.stock === 0 ? 'Fora de Estoque' : `${product.stock} em estoque`}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-gag-white mb-2">{product.name}</h3>
                          <p className="text-gray-300 mb-4">
                            {product.description || "Sem descrição disponível"}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-gag-cyan">
                              R$ {product.price.toFixed(2)}
                            </span>
                            <Button
                              onClick={() => {
                                if (product.stock === 0) {
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
                              }}
                              disabled={product.stock === 0}
                              className={cn(
                                "flex items-center gap-2",
                                product.stock === 0 
                                  ? "bg-gray-700 hover:bg-gray-700 cursor-not-allowed" 
                                  : "bg-gag-blue hover:bg-gag-blue-dark"
                              )}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Adicionar ao Carrinho
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-black/30 backdrop-blur-sm border border-gag-cyan/20 rounded-lg">
                <ShoppingBag className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-400">
                  {selectedCategory 
                    ? "Não há produtos nesta categoria no momento." 
                    : "Não há produtos disponíveis no momento."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductShowcase;
