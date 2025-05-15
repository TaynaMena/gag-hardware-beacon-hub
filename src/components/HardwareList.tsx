
import React, { useState, useMemo } from 'react';
import { hardwareData, HardwareItem } from '@/data/hardware';
import HardwareCard from './HardwareCard';
import SearchFilter from './SearchFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Filter, Star, ArrowUp, ArrowDown } from 'lucide-react';

const HardwareList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name-asc');

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 1000]);
  };

  const filteredItems = useMemo(() => {
    return hardwareData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === "all_categories" || item.category === selectedCategory;
      const matchesBrand = !selectedBrand || selectedBrand === "all_brands" || item.brand === selectedBrand;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [search, selectedCategory, selectedBrand, priceRange]);

  const sortedItems = useMemo(() => {
    const [property, direction] = sortBy.split('-');
    
    return [...filteredItems].sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;
      
      if (property === 'price') {
        valueA = a.price;
        valueB = b.price;
      } else if (property === 'rating') {
        valueA = a.rating;
        valueB = b.rating;
      } else {
        valueA = a.name;
        valueB = b.name;
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return direction === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });
  }, [filteredItems, sortBy]);

  return (
    <div>
      <SearchFilter
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        clearFilters={clearFilters}
      />
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p className="text-gray-300 mb-2 sm:mb-0">
          Mostrando {sortedItems.length} de {hardwareData.length} produtos
        </p>
        <div className="flex items-center bg-black/40 rounded-md border border-gag-cyan/30 p-2">
          <Filter className="h-4 w-4 text-gag-cyan mr-2" />
          <span className="text-sm text-gray-300 mr-2">Ordenar por:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-none bg-transparent text-gag-white w-[140px] focus:ring-0">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-gag-dark border border-gag-cyan/30">
              <SelectItem value="name-asc" className="text-gag-white focus:bg-gag-cyan/20 focus:text-gag-white">
                <div className="flex items-center">
                  Nome (A-Z) <ArrowDown className="ml-2 h-3 w-3" />
                </div>
              </SelectItem>
              <SelectItem value="name-desc" className="text-gag-white focus:bg-gag-cyan/20 focus:text-gag-white">
                <div className="flex items-center">
                  Nome (Z-A) <ArrowUp className="ml-2 h-3 w-3" />
                </div>
              </SelectItem>
              <SelectItem value="price-asc" className="text-gag-white focus:bg-gag-cyan/20 focus:text-gag-white">
                <div className="flex items-center">
                  Preço (menor) <ArrowDown className="ml-2 h-3 w-3" />
                </div>
              </SelectItem>
              <SelectItem value="price-desc" className="text-gag-white focus:bg-gag-cyan/20 focus:text-gag-white">
                <div className="flex items-center">
                  Preço (maior) <ArrowUp className="ml-2 h-3 w-3" />
                </div>
              </SelectItem>
              <SelectItem value="rating-desc" className="text-gag-white focus:bg-gag-cyan/20 focus:text-gag-white">
                <div className="flex items-center">
                  Avaliação <Star className="ml-2 h-3 w-3 fill-yellow-400" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedItems.length === 0 ? (
        <Alert className="bg-black/40 border border-gag-cyan/30 text-gag-white">
          <AlertDescription>
            Nenhum produto corresponde aos critérios de busca. Tente ajustar seus filtros.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="product-grid">
          {sortedItems.map((item: HardwareItem) => (
            <HardwareCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HardwareList;
