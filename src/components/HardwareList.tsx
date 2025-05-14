
import React, { useState, useMemo } from 'react';
import { hardwareData, HardwareItem } from '@/data/hardware';
import HardwareCard from './HardwareCard';
import SearchFilter from './SearchFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Hardware Components</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedItems.length === 0 ? (
        <Alert>
          <AlertDescription>
            No hardware components match your search criteria. Try adjusting your filters.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="hardware-grid">
          {sortedItems.map((item: HardwareItem) => (
            <HardwareCard key={item.id} item={item} />
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {sortedItems.length} of {hardwareData.length} items
      </div>
    </div>
  );
};

export default HardwareList;
