'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export default function ProductListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch(`/store/products/?search=${search}&category=${selectedCategory}&sort=${sort}`),
        apiFetch('/store/categories/'),
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-primary" /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === '' ? 'bg-primary text-white font-bold' : 'text-gray-600 hover:bg-secondary'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id.toString() ? 'bg-primary text-white font-bold' : 'text-gray-600 hover:bg-secondary'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-primary" /> Sort By
            </h3>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 ring-primary outline-none"
            >
              <option value="">Default</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by medicine name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 pl-14 focus:ring-2 ring-primary outline-none shadow-sm transition-all"
            />
            <Search className="absolute left-6 top-4.5 text-gray-400" size={20} />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No products found matching your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
