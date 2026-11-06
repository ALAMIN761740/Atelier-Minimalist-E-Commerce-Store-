import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Product, PageRoute } from '../types/ecommerce';
import { ProductCard } from '../components/ProductCard';

interface SearchResultsPageProps {
  initialQuery: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onNavigate: (page: PageRoute) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery,
  products,
  onSelectProduct,
  onQuickAdd,
  wishlist,
  onToggleWishlist,
  onNavigate
}) => {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  }, [products, query]);

  const popularKeywords = ['Cashmere', 'Tote', 'Sneaker', 'Terracotta', 'Trouser', 'Wool'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Search Header */}
      <div className="border-b border-stone-200 pb-6 space-y-4">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Catalog Search
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
          {query.trim() ? `Search Results for "${query}"` : 'Search the Collection'}
        </h1>

        {/* Live Search Input Bar */}
        <div className="relative max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by fiber, category, or garment name..."
            autoFocus
            className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white placeholder-stone-400 outline-none focus:border-stone-900 shadow-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 pt-1">
          <span>Popular searches:</span>
          {popularKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="flex justify-between items-center text-xs text-stone-500">
        <span>Found {results.length} {results.length === 1 ? 'result' : 'results'}</span>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-stone-700 underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-md mx-auto">
          <p className="text-base font-bold text-stone-900 font-display">No matches for "{query}"</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn't find items matching your exact search. Try exploring our primary divisions or checking your spelling.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map((product) => (
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

    </div>
  );
};
