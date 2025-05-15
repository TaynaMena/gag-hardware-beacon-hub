
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '@/types/Product';
import { getAllProducts } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const OfferBanner = () => (
  <div className="w-full bg-gradient-to-r from-gag-blue to-gag-blue-dark rounded-lg shadow-lg p-8 mb-12 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(21,241,255,0.2),transparent_70%)]"></div>
    </div>
    <div className="relative z-10">
      <span className="bg-gag-lime text-gag-dark text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">Ofertas exclusivas</span>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        Promoções <span className="text-gag-lime">imperdíveis</span>
      </h1>
      <p className="text-xl mb-6 text-gray-100 max-w-2xl">
        Economize em equipamentos de alta qualidade para montar seu setup perfeito.
        Descontos especiais por tempo limitado!
      </p>
    </div>
  </div>
);

const OfferCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0;
  
  // Simular um desconto entre 10% e 30%
  const discountPercent = Math.floor(Math.random() * 20) + 10;
  const originalPrice = product.price;
  const discountedPrice = parseFloat((originalPrice * (1 - discountPercent / 100)).toFixed(2));
  
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Este produto está fora de estoque');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice, // Usar o preço com desconto
      quantity: 1,
      image_url: product.image_url
    });
    
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gag-cyan/30 overflow-hidden transition-all hover:shadow-[0_0_15px_rgba(21,241,255,0.3)] hover:border-gag-cyan/50">
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gag-lime text-gag-dark font-bold px-2 py-1">
          -{discountPercent}%
        </Badge>
      </div>
      <div className="relative h-52 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/60">
            <Tag size={48} className="text-gag-cyan" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-16"></div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gag-cyan">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-xl font-bold text-gag-lime">
            R$ {discountedPrice.toFixed(2)}
          </span>
          <span className="text-sm line-through text-gray-400">
            R$ {originalPrice.toFixed(2)}
          </span>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full group flex items-center justify-center gap-2",
            isOutOfStock 
              ? "bg-gray-700 text-gray-400" 
              : "bg-gag-lime text-gag-dark hover:bg-gag-lime/90"
          )}
        >
          <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
          {isOutOfStock ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

const Offers = () => {
  const [offerType, setOfferType] = useState<string>('all');
  
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });

  // Filtrar produtos aleatoriamente para simular ofertas
  const getRandomProducts = (products: Product[], count: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Obter produtos em oferta simulados
  const getOffersProducts = () => {
    if (allProducts.length === 0) return [];
    
    const offerProducts = allProducts.filter(p => p.stock > 0);
    
    switch (offerType) {
      case 'flash':
        return getRandomProducts(offerProducts, 4);
      case 'clearance':
        return getRandomProducts(offerProducts, 8);
      case 'weekly':
        return getRandomProducts(offerProducts, 6);
      default:
        return getRandomProducts(offerProducts, 12);
    }
  };
  
  const offerProducts = getOffersProducts();

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-900/30 border border-red-700 text-red-100 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>Ocorreu um erro ao carregar as ofertas. Tente novamente mais tarde.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <OfferBanner />
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gag-white">Categorias de Ofertas</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setOfferType('all')}
              variant={offerType === 'all' ? 'default' : 'outline'}
              className={cn(
                "border border-gag-cyan/30",
                offerType === 'all' ? "bg-gag-blue text-white" : "bg-transparent text-gag-white"
              )}
            >
              Todas as Ofertas
            </Button>
            <Button 
              onClick={() => setOfferType('flash')}
              variant={offerType === 'flash' ? 'default' : 'outline'}
              className={cn(
                "border border-gag-cyan/30",
                offerType === 'flash' ? "bg-gag-blue text-white" : "bg-transparent text-gag-white"
              )}
            >
              Ofertas Relâmpago
            </Button>
            <Button 
              onClick={() => setOfferType('weekly')}
              variant={offerType === 'weekly' ? 'default' : 'outline'}
              className={cn(
                "border border-gag-cyan/30",
                offerType === 'weekly' ? "bg-gag-blue text-white" : "bg-transparent text-gag-white"
              )}
            >
              Ofertas da Semana
            </Button>
            <Button 
              onClick={() => setOfferType('clearance')}
              variant={offerType === 'clearance' ? 'default' : 'outline'}
              className={cn(
                "border border-gag-cyan/30",
                offerType === 'clearance' ? "bg-gag-blue text-white" : "bg-transparent text-gag-white"
              )}
            >
              Liquidação
            </Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gag-cyan flex items-center">
            <Tag className="mr-2 h-6 w-6" />
            {offerType === 'all' && 'Todas as Ofertas'}
            {offerType === 'flash' && 'Ofertas Relâmpago'}
            {offerType === 'weekly' && 'Ofertas da Semana'}
            {offerType === 'clearance' && 'Liquidação'}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gag-cyan mx-auto"></div>
              <p className="mt-4 text-gray-300">Carregando ofertas...</p>
            </div>
          ) : offerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerProducts.map(product => (
                <OfferCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-black/40 backdrop-blur-md rounded-lg border border-gag-cyan/20">
              <Tag size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-xl text-gray-300">Nenhuma oferta disponível no momento.</p>
              <p className="text-gray-400 mt-2">Volte em breve para novas promoções!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
