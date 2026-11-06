import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/products';
import { PageRoute } from '../types/ecommerce';

interface CategoriesPageProps {
  onSelectCategory: (category: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectCategory,
  onNavigate
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 max-w-2xl">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Architectural Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display mt-1">
          Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
          Explore our four pillar divisions. Every item is produced in small numbered workshop batches with traceable raw fiber and leather origins.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES_DATA.map((cat, idx) => (
          <div
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
              onNavigate('shop');
            }}
            className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 cursor-pointer shadow-lg hover:shadow-2xl transition-all aspect-[16/10] flex flex-col justify-end p-8 text-white"
          >
            <img
              src={cat.image}
              alt={cat.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 tracking-wider">
                  DIVISION 0{idx + 1} · {cat.itemCount}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 group-hover:text-white group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {cat.name}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sourcing Promise Banner */}
      <div className="p-8 rounded-3xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-stone-900 font-display">Need assistance selecting sizing or leather care?</h3>
          <p className="text-xs text-stone-500 mt-0.5">Our client concierge team in San Francisco is available Monday through Saturday.</p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
        >
          Contact Client Concierge
        </button>
      </div>

    </div>
  );
};
