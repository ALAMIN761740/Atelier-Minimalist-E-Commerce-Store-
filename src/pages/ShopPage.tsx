import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, ChevronDown, ChevronLeft, 
  ChevronRight, ArrowUpDown, X, Filter, Grid3X3, LayoutGrid 
} from 'lucide-react';
import { Product } from '../types/ecommerce';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  wishlist,
  onToggleWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [priceRange, setPriceRange] = useState<'all' | 'under-100' | '100-200' | 'over-200'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & sort
  const filtered = useMemo(() => {
    return products.filter(p => {
      // Category
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      // Search
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      // Price
      const matchesPrice = 
        priceRange === 'all' ? true :
        priceRange === 'under-100' ? p.price < 100 :
        priceRange === '100-200' ? p.price >= 100 && p.price <= 200 :
        p.price > 200;
      // In Stock
      const matchesStock = !inStockOnly || p.stock > 0;

      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    onSelectCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setInStockOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Permanent Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display mt-1">
          The Full Collection
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-xl">
          Timeless wardrobe staples and architectural lifestyle objects crafted in limited small batches.
        </p>
      </div>

      {/* Control Bar: Categories, Filters, Search & Sorting */}
      <div className="space-y-4">
        
        {/* Top Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-xl overflow-x-auto max-w-full gap-1">
            {(['All', 'Apparel', 'Footwear', 'Accessories', 'Lifestyle'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search catalog..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-200 bg-white placeholder-stone-400 outline-none focus:border-stone-900 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-medium py-2 pl-3 pr-8 rounded-xl outline-none hover:border-stone-400 cursor-pointer"
                aria-label="Sort products"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Secondary Refinement Row: Price Filter, In Stock Toggle, Active Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-stone-700">Price:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'under-100', label: '< $100' },
                { id: '100-200', label: '$100–$200' },
                { id: 'over-200', label: '> $200' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPriceRange(opt.id as any);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    priceRange === opt.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="text-stone-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-stone-900"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-mono text-[11px]">
              Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
            {(selectedCategory !== 'All' || searchQuery || priceRange !== 'all' || inStockOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-stone-400 hover:text-stone-800 underline text-[11px] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Product Grid or Empty State */}
      {paginatedProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-base font-bold text-stone-900 font-display">No matching items found</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query, price filter, or category selection to find what you're looking for.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-stone-200">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === num
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
