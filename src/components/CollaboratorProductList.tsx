
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types/Product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters when search term or category changes
  useEffect(() => {
    let result = products;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url || undefined,
    });
  };
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))) as ProductCategory[];
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Todas categorias" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Product Grid */}
      {isLoading ? (
        <div className="text-center py-8">Carregando produtos...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 w-full bg-gray-100 relative overflow-hidden">
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
                <Badge 
                  className="absolute top-2 right-2"
                  variant={product.stock > 0 ? "default" : "destructive"}
                >
                  {product.stock > 0 ? `Em estoque: ${product.stock}` : "Indisponível"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">{product.name}</h3>
                <Badge variant="outline" className="mb-2">{product.category}</Badge>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description || "Sem descrição disponível"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-blue-800">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock < 1}
                    size="sm"
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto encontrado para os filtros aplicados.
        </div>
      )}
    </div>
  );
};
