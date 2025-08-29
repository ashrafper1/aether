"use client";
import { useState, useEffect } from "react";

export default function ProductFilters({ onFiltersChange, isOpen, onClose }) {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 20000,
    strapMaterial: [],
    style: []
  });

  const strapMaterials = ["Steel", "Leather", "Gold", "Titanium"];
  const styles = ["Chronograph", "Minimalist", "Skeleton", "Diver"];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  const handleStrapMaterialChange = (material) => {
    const newStrapMaterial = toggleArrayItem(filters.strapMaterial, material);
    handleFilterChange({ ...filters, strapMaterial: newStrapMaterial });
  };

  const handleStyleChange = (style) => {
    const newStyle = toggleArrayItem(filters.style, style);
    handleFilterChange({ ...filters, style: newStyle });
  };

  const handleMinPriceChange = (value) => {
    const minPrice = Math.min(parseInt(value), filters.maxPrice - 100);
    handleFilterChange({ ...filters, minPrice });
  };

  const handleMaxPriceChange = (value) => {
    const maxPrice = Math.max(parseInt(value), filters.minPrice + 100);
    handleFilterChange({ ...filters, maxPrice });
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: 0,
      maxPrice: 20000,
      strapMaterial: [],
      style: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <>
      {/* Filter Panel - Always slides in from right when triggered */}
      <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">PRICE RANGE</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>₹{filters.minPrice.toLocaleString()}</span>
                <span>₹{filters.maxPrice.toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={filters.minPrice}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strap Material */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">STRAP MATERIAL</h3>
            <div className="space-y-3">
              {strapMaterials.map((material) => (
                <label key={material} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.strapMaterial.includes(material)}
                    onChange={() => handleStrapMaterialChange(material)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">STYLE</h3>
            <div className="space-y-3">
              {styles.map((style) => (
                <label key={style} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.style.includes(style)}
                    onChange={() => handleStyleChange(style)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
} 