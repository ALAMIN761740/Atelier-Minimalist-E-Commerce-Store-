import React, { useState } from 'react';
import { ArrowLeft, Search, Compass, ShoppingBag } from 'lucide-react';
import { Product, PageRoute } from '../types/ecommerce';

interface NotFoundPageProps {
  onNavigate: (page: PageRoute) => void;
  onSearch: (query: string) => void;
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigate,
  onSearch,
  featuredProducts,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onNavigate('search');
    }
  };

  return (
    <div className="min-h-[70vh] bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Subtle label */}
        <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
          Error 404 · Atelier Archival Note
        </p>

        <h1 className="text-7xl sm:text-9xl font-light text-stone-300 font-serif tracking-tight mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4">
          The requested page could not be located
        </h2>

        <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8">
          The collection, article, or resource you are looking for may have been archived, renamed, or is temporarily unavailable in this edition.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, footwear, accessories..."
              className="w-full bg-white border border-stone-300 rounded-full py-3 pl-5 pr-12 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              aria-label="Submit Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Homepage
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:border-stone-900 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Browse Full Catalog
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:border-stone-900 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            Explore Categories
          </button>
        </div>

        {/* Suggested Collections Preview */}
        {featuredProducts.length > 0 && (
          <div className="text-left border-t border-stone-200 pt-12">
            <h3 className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-6 text-center">
              Curated Highlights from Edition 04
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-white rounded-xl border border-stone-200 overflow-hidden cursor-pointer hover:border-stone-400 transition-all shadow-2xs"
                >
                  <div className="aspect-square bg-stone-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                      {product.category}
                    </p>
                    <p className="text-xs font-medium text-stone-900 truncate mt-0.5">
                      {product.name}
                    </p>
                    <p className="text-xs font-serif text-stone-900 mt-1">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
