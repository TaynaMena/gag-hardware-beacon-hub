
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HardwareItem } from '@/data/hardware';
import { Star, Info } from 'lucide-react';

interface HardwareCardProps {
  item: HardwareItem;
}

const HardwareCard: React.FC<HardwareCardProps> = ({ item }) => {
  const { name, brand, category, price, rating, inStock, image, description } = item;
  
  return (
    <Card className="hardware-card h-full flex flex-col">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={inStock ? "default" : "destructive"} className="bg-white text-black hover:bg-gray-100">
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="bg-hub-gray text-hub-blue-light">
            {category}
          </Badge>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium text-hub-blue">{rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold line-clamp-1 text-hub-blue">{name}</h3>
        <p className="text-sm text-hub-gray-dark mb-1">{brand}</p>
        <p className="text-sm line-clamp-2 text-gray-600 mt-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-lg font-bold text-hub-blue">${price.toFixed(2)}</span>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex items-center">
            <Info className="h-4 w-4 mr-1" /> Details
          </Button>
          <Button size="sm" disabled={!inStock}>
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HardwareCard;
