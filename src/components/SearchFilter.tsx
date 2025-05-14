
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { categories, brands } from '@/data/hardware';
import { SliderProps } from '@radix-ui/react-slider';
import { X } from 'lucide-react';

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  clearFilters: () => void;
}

const PriceRangeSlider = ({ value, onValueChange }: SliderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700">
          ${Array.isArray(value) ? value[0] : 0}
        </span>
        <span className="text-sm font-medium text-gray-700">
          ${Array.isArray(value) ? value[1] : 1000}
        </span>
      </div>
      <Slider
        defaultValue={value}
        max={1000}
        step={10}
        onValueChange={onValueChange}
        className="w-full"
      />
    </div>
  );
};

const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  clearFilters,
}) => {
  const handleSliderChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const activeFiltersCount = [
    !!selectedCategory,
    !!selectedBrand,
    priceRange[0] > 0 || priceRange[1] < 1000,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filters</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search hardware..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow"
          />
          <Button variant="default">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <Select
            value={selectedBrand}
            onValueChange={setSelectedBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all_brands">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <PriceRangeSlider
            value={priceRange}
            onValueChange={handleSliderChange}
          />
        </div>
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Active filters:</span>
            <div className="flex gap-2 flex-wrap">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory === "all_categories" ? "All Categories" : selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Brand: {selectedBrand === "all_brands" ? "All Brands" : selectedBrand}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedBrand("")} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setPriceRange([0, 1000])} 
                  />
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
