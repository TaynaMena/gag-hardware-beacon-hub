
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HardwareItem } from '@/data/hardware';
import { Star, Info, ShoppingCart } from 'lucide-react';

interface HardwareCardProps {
  item: HardwareItem;
}

const HardwareCard: React.FC<HardwareCardProps> = ({ item }) => {
  const { name, brand, category, price, rating, inStock, image, description } = item;
  
  return (
    <Card className="gag-card h-full flex flex-col">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={inStock ? "default" : "destructive"} className={inStock ? "bg-gag-lime text-gag-dark font-medium hover:bg-gag-lime/90" : "bg-red-500"}>
            {inStock ? "Em Estoque" : "Fora de Estoque"}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="bg-gag-blue/20 text-gag-cyan border-gag-cyan/30 hover:bg-gag-blue/30">
            {category}
          </Badge>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium text-gag-cyan">{rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold line-clamp-1 text-gag-white">{name}</h3>
        <p className="text-sm text-gag-cyan mb-1">{brand}</p>
        <p className="text-sm line-clamp-2 text-gray-300 mt-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-gag-lime">R${price.toFixed(2)}</span>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="border-gag-cyan/30 text-gag-cyan hover:bg-gag-cyan/10 hover:border-gag-cyan flex items-center">
            <Info className="h-4 w-4 mr-1" /> Detalhes
          </Button>
          <Button size="sm" disabled={!inStock} className="bg-gag-blue hover:bg-gag-blue-dark flex items-center">
            <ShoppingCart className="h-4 w-4 mr-1" /> Comprar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HardwareCard;
