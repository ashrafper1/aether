"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 20000,
    strapMaterial: [],
    style: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters) => {
    setFilters(newFilters);
    setFilterLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (newFilters.minPrice > 0) params.append('minPrice', newFilters.minPrice);
      if (newFilters.maxPrice < 20000) params.append('maxPrice', newFilters.maxPrice);
      if (newFilters.strapMaterial.length > 0) {
        newFilters.strapMaterial.forEach(material => {
          params.append('strapMaterial', material);
        });
      }
      if (newFilters.style.length > 0) {
        newFilters.style.forEach(style => {
          params.append('style', style);
        });
      }

      const queryString = params.toString();
      const url = queryString ? `${API_URL}/api/products?${queryString}` : `${API_URL}/api/products`;
      
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?cs=srgb&dl=pexels-pixabay-277319.jpg&fm=jpg" alt="" className="w-full h-[560px] object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl font-serif mb-3">The Art of Time</h1>
          <p className="opacity-90">Exceptional timepieces for extraordinary moments</p>
          <Link href="/products" className="p-2 px-4 rounded-md font-semibold bg-white text-black mt-6">Explore Collection</Link>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Timepieces</h2>
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Filters Component */}
        <ProductFilters
          onFiltersChange={handleFiltersChange}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        {/* Results Count */}
        {!filterLoading && (
          <div className="mb-4 text-sm text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}

        {/* Loading State */}
        {filterLoading && (
          <div className="text-center py-4 text-slate-500">
            Applying filters...
          </div>
        )}

        {/* Products Grid */}
        {!filterLoading && filteredProducts.length === 0 ? (
          <div className="text-slate-500 text-center py-12">
            {products.length === 0 ? "No products yet. Add some via the API." : "No products match your filters."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, 6).map(p => <ProductCard key={p._id} p={p} />)}
          </div>
        )}

        {/* View All Button */}
        {filteredProducts.length > 6 && (
          <div className="p-4 text-center mt-8">
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View All Products
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Filter Overlay */}
      {filtersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
