import React from 'react';
import { 
  ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, 
  Star, Heart, ShoppingBag, Eye, Award, CheckCircle2 
} from 'lucide-react';
import { Product, PageRoute } from '../types/ecommerce';
import { HERO_IMAGE, CATEGORIES_DATA } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onNavigate: (page: PageRoute) => void;
  onSelectCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  wishlist,
  onToggleWishlist,
  onNavigate,
  onSelectCategory
}) => {
  const bestSellers = products.filter(p => p.isBestSeller || p.rating >= 4.9).slice(0, 3);
  const newArrivals = products.filter(p => p.isNewArrival || p.tag === 'New Release').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Copy & Direct Collection CTA */}
            <div className="lg:col-span-5 space-y-6 z-10 text-left">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-300 font-medium">
                <span>Autumn / Winter 2026</span>
                <span>·</span>
                <span>Direct Atelier Edition 04</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
                Form, Fibre & Architectural Utility.
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Curated minimalist apparel, handcrafted Italian calfskin leather goods, and artisanal Japanese ceramics built with architectural restraint.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('categories')}
                  className="px-5 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-white font-medium text-xs border border-stone-700 transition-colors cursor-pointer"
                >
                  Explore Categories
                </button>
              </div>

              {/* Proof Adjacency Metrics */}
              <div className="pt-6 border-t border-stone-800 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="block text-lg font-bold font-mono text-white">100%</span>
                  <span className="text-stone-400 text-[11px]">Traceable Origin</span>
                </div>
                <div>
                  <span className="block text-lg font-bold font-mono text-white">1–2 Day</span>
                  <span className="text-stone-400 text-[11px]">Express Courier</span>
                </div>
                <div>
                  <span className="block text-lg font-bold font-mono text-white">★ 4.92</span>
                  <span className="text-stone-400 text-[11px]">Verified Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-800 group">
                <img
                  src={HERO_IMAGE}
                  alt="Atelier Luxury Fashion Campaign"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs text-stone-300">
                  <span className="bg-stone-900/90 backdrop-blur-xs px-3 py-1 rounded-md font-mono text-[11px] border border-stone-700">
                    Campaign 04 / Milan Architectural Shoot
                  </span>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hidden sm:flex items-center gap-1 text-stone-300 hover:text-white underline text-xs cursor-pointer"
                  >
                    <span>Read Campaign Story</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-600">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Complimentary Courier</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Free carbon-neutral delivery on all orders over $150.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Bank-Grade Gateway</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Level 1 PCI-DSS encryption with 3D Secure verification.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">30-Day Hassle-Free Returns</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Prepaid postal label included in every luxury parcel.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900">Artisan Craftsmanship</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Direct partnership with generational master ateliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Curated Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Shop by Architectural Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onNavigate('shop');
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-300">
                  {cat.itemCount}
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                  {cat.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:underline">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST-SELLING PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Iconic Essentials</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Atelier Best Sellers
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Most requested by clients across North America and Europe.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Shop Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bestSellers.map((product) => (
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
      </section>

      {/* 5. EDITORIAL PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-xl">
          <div className="max-w-xl space-y-4 z-10 relative">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
              Limited Small-Batch Release
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
              Grade-A Mongolian Cashmere & Tuscan Saddle Leathers
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We produce in limited editions to prevent surplus waste. Every piece is numbered and crafted by hand in certified artisan facilities.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition-all cursor-pointer shadow-md"
              >
                Browse Edition 04
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-xs font-semibold text-stone-300 hover:text-white underline cursor-pointer"
              >
                Learn About Our Sourcing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Fresh From Workshops</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              New Releases & Studio Objects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
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
      </section>

      {/* 7. WHY CHOOSE US & CRAFTSMANSHIP ESSAY */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              The Atelier Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Why Discerning Collectors Choose Atelier
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              By eliminating traditional department store distributor markups, 100% of our budget goes into Grade-A raw materials, living artisan wages, and lifetime repairability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="text-lg font-bold font-mono text-stone-900">01</span>
              <h4 className="text-base font-bold text-stone-900">Vegetable-Tanned Leathers</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tanned using natural chestnut and mimosa tannins in Tuscany. Develops a personal amber patina over decades rather than peeling or cracking.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="text-lg font-bold font-mono text-stone-900">02</span>
              <h4 className="text-base font-bold text-stone-900">Zero Artificial Polymers</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We refuse acrylic blends or petroleum polyester linings. Our knits and cottons are 100% organic, biodegradable, and gentle on sensitive skin.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <span className="text-lg font-bold font-mono text-stone-900">03</span>
              <h4 className="text-base font-bold text-stone-900">Direct From the Master Craftsman</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Traceable production codes on every garment. Fair living wages paid directly to family-owned mills in Biella and ceramic studios in Kyoto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS (Based on Verified Purchases) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Verified Client Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Loved by Discerning Minimalists
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              "The Merino Cashmere Crewneck has ruined all other sweaters for me. The weight and architectural drape are simply peerless."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="font-semibold text-stone-900">Camille V. · Architect</span>
              <span className="text-emerald-700 font-medium">Verified Purchase</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              "The calfskin leather tote fits my laptop and sketchbook with ease. After four months of daily train commutes, the patina looks stunning."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="font-semibold text-stone-900">Soren M. · Industrial Designer</span>
              <span className="text-emerald-700 font-medium">Verified Purchase</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              "The Strobel stitch sneakers required zero break-in days. Clean silhouette that works under tailored trousers or weekend denim."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="font-semibold text-stone-900">David L. · Creative Director</span>
              <span className="text-emerald-700 font-medium">Verified Purchase</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
