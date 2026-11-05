import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, SlidersHorizontal, ArrowUpDown, ChevronDown, 
  Truck, ShieldCheck, RefreshCw, Heart, Eye, ArrowRight,
  Smartphone, Monitor, Check, ShoppingBag
} from 'lucide-react';
import { PRODUCTS, HERO_IMAGE } from './data/products';
import { INITIAL_REVIEWS } from './data/reviews';
import { Product, CartItem, Order, ProductReview } from './types/ecommerce';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderHistoryDrawer } from './components/OrderHistoryDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { WishlistSection } from './components/WishlistSection';

export default function App() {
  // LocalStorage persistence for Cart, Orders, Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [
        // Seed 1 starter item for instant exploration
        {
          id: 'prod-01-Oatmeal Heather-M',
          product: PRODUCTS[0],
          quantity: 1,
          selectedColor: 'Oatmeal Heather',
          selectedSize: 'M'
        }
      ];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : ['prod-02'];
    } catch {
      return [];
    }
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('SAVE15');
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0.15); // default 15% discount for first-time visitors!

  // Mobile Bottom Nav Active Tab
  const [mobileTab, setMobileTab] = useState<'shop' | 'search' | 'wishlist' | 'bag' | 'tracking' | 'orders'>('shop');
  
  // Desktop simulator for Mobile Device Frame
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_product_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_product_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Set latest active order for tracking if available
  const activeOrder = useMemo(() => {
    return orders.find(o => o.orderStatus !== 'delivered') || orders[0] || null;
  }, [orders]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // default popular
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, color: string, size: string, quantity: number = 1) => {
    setCart(prev => {
      const cartItemId = `${product.id}-${color}-${size}`;
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: cartItemId, product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, product.colors[0]?.name || 'Standard', product.sizes[0] || 'Standard', 1);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleInstantBuy = (product: Product, color: string, size: string, quantity: number) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const handleMoveToCart = (product: Product, color?: string, size?: string) => {
    const selectedColor = color || product.colors[0]?.name || 'Standard';
    const selectedSize = size || product.sizes[0] || 'Standard';
    handleAddToCart(product, selectedColor, selectedSize, 1);
  };

  const handleMoveAllToCart = (productsToMove: Product[]) => {
    productsToMove.forEach(product => {
      const selectedColor = product.colors[0]?.name || 'Standard';
      const selectedSize = product.sizes[0] || 'Standard';
      handleAddToCart(product, selectedColor, selectedSize, 1);
    });
    setIsCartOpen(true);
  };

  const handleAddReview = (reviewData: {
    productId: string;
    authorName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    recommended: boolean;
    fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
  }) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      helpfulCount: 0,
      ...reviewData
    };

    setReviews(prev => [newReview, ...prev]);
  };

  const handleApplyPromo = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'SAVE15') {
      setPromoCode('SAVE15');
      setPromoDiscountRate(0.15);
      return true;
    } else if (cleaned === 'FREESHIP' || cleaned === 'VIP20') {
      setPromoCode(cleaned);
      setPromoDiscountRate(0.20);
      return true;
    }
    return false;
  };

  // Order Placement callback
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(newOrder);
    setIsTrackingOpen(true);
  };

  // Handle Order Updates from Live Simulator
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o));
    setActiveTrackingOrder(updatedOrder);
  };

  // Handle Mobile Bottom Nav Tab Selection
  const handleMobileTabSelect = (tab: 'shop' | 'search' | 'wishlist' | 'bag' | 'tracking' | 'orders') => {
    setMobileTab(tab);
    if (tab === 'shop') {
      setSelectedCategory('All');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'search') {
      const searchElem = document.getElementById('search-catalog-input');
      searchElem?.focus();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } else if (tab === 'wishlist') {
      setIsWishlistDrawerOpen(true);
    } else if (tab === 'bag') {
      setIsCartOpen(true);
    } else if (tab === 'tracking') {
      if (activeOrder) {
        setActiveTrackingOrder(activeOrder);
        setIsTrackingOpen(true);
      } else {
        setIsOrdersOpen(true);
      }
    } else if (tab === 'orders') {
      setIsOrdersOpen(true);
    }
  };

  // Main UI Tree
  const appContent = (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-20 md:pb-0">
      
      {/* Universal Top Bar */}
      <Navbar
        cart={cart}
        orders={orders}
        activeOrder={activeOrder}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenTracking={(order) => {
          setActiveTrackingOrder(order);
          setIsTrackingOpen(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
      />

      <main className="flex-grow">
        
        {/* HERO CAMPAIGN SECTION (Focal Visual Anchor) */}
        <section className="relative overflow-hidden bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Copy & Direct Collection CTA */}
              <div className="lg:col-span-5 space-y-6 z-10 text-left">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-300 font-medium">
                  <span>Autumn / Winter Collection</span>
                  <span>·</span>
                  <span>Direct Atelier</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
                  Form, Fibre & Architectural Utility.
                </h1>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
                  Curated minimalist apparel, handcrafted Italian leather accessories, and artisanal ceramics built to outlast seasonal trends.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('collection-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full bg-white text-stone-900 font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 active:scale-95 transition-all cursor-pointer shadow-lg"
                  >
                    Explore Catalog
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(PRODUCTS[0]);
                    }}
                    className="px-5 py-3 rounded-full bg-stone-800/80 hover:bg-stone-800 text-white font-medium text-xs border border-stone-700 transition-colors cursor-pointer"
                  >
                    View Featured Knit
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
                    <span className="text-stone-400 text-[11px]">Customer Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-800 group">
                  <img
                    src={HERO_IMAGE}
                    alt="Atelier Fashion Campaign"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs text-stone-300">
                    <span className="bg-stone-900/80 backdrop-blur-xs px-2.5 py-1 rounded font-mono text-[11px]">
                      Campaign 04 / Milan & Copenhagen
                    </span>
                    <span className="hidden sm:inline text-stone-400">
                      Shot on 35mm film
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TRUST BANNER STRIP */}
        <section className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-stone-800 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Complimentary Shipping</p>
                <p className="text-[11px] text-stone-500">Free courier over $150</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Secure Payment Gateway</p>
                <p className="text-[11px] text-stone-500">PCI-DSS Level 1 Encrypted</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-stone-800 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">30-Day Hassle-Free Returns</p>
                <p className="text-[11px] text-stone-500">Prepaid shipping label</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-stone-800 shrink-0" />
              <div>
                <p className="font-semibold text-stone-900">Real-Time Dispatch</p>
                <p className="text-[11px] text-stone-500">Live GPS courier telemetry</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATALOG COLLECTION & WISHLIST SECTION */}
        <section id="collection-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          
          {/* Header & Controls Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                {selectedCategory === 'Wishlist' ? 'Your Saved Wishlist' : 'Featured Collection'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {selectedCategory === 'Wishlist'
                  ? `${wishlist.length} items liked · Ready to purchase`
                  : `Showing ${filteredProducts.length} handcrafted essentials`}
              </p>
            </div>

            {/* Interactive Filter Tabs (Segmented Control) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 bg-stone-200/70 rounded-xl overflow-x-auto max-w-full gap-1">
                {(['All', 'Apparel', 'Footwear', 'Accessories', 'Lifestyle'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Dedicated Wishlist Tab */}
                <button
                  onClick={() => setSelectedCategory('Wishlist')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'Wishlist'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label={`Wishlist with ${wishlist.length} saved items`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'Wishlist' ? 'fill-current' : 'text-rose-500'}`} />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                      selectedCategory === 'Wishlist' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Sorting Selector (hidden on Wishlist tab) */}
              {selectedCategory !== 'Wishlist' && (
                <div className="relative flex items-center">
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
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* DEDICATED WISHLIST VIEW OR PRODUCT CARDS GRID */}
          {selectedCategory === 'Wishlist' ? (
            <WishlistSection
              wishlistProductIds={wishlist}
              allProducts={PRODUCTS}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onMoveToCart={handleMoveToCart}
              onMoveAllToCart={handleMoveAllToCart}
              onOpenProductDetail={(p) => setSelectedProduct(p)}
              onExploreCatalog={() => setSelectedCategory('All')}
            />
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-stone-500">
              <p className="text-sm font-semibold">No items match your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-stone-900 underline font-medium cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onQuickAdd={handleQuickAdd}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>

              {/* Wishlist Spotlight Banner (if user has items saved and is browsing catalog) */}
              {wishlist.length > 0 && (
                <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                        You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your Wishlist
                      </h4>
                      <p className="text-xs text-stone-500">
                        Move all liked pieces directly to your cart or review your saved items.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleMoveAllToCart(PRODUCTS.filter(p => wishlist.includes(p.id)))}
                      className="flex-1 sm:flex-none px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move All to Cart</span>
                    </button>
                    <button
                      onClick={() => setSelectedCategory('Wishlist')}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-white text-stone-800 border border-stone-200 hover:bg-stone-100 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Open Wishlist</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Active Order Notification Bar (Adjacency & Quick Access) */}
          {activeOrder && (
            <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">Active Order #{activeOrder.orderId}</span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold uppercase">
                      {activeOrder.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Carrier: {activeOrder.tracking.carrier} · ETA: {activeOrder.tracking.estimatedDelivery}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTrackingOrder(activeOrder);
                  setIsTrackingOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Live GPS Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </section>

        {/* CRAFTSMANSHIP & STORY SECTION */}
        <section className="bg-stone-100 py-16 border-t border-stone-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              The Atelier Ethos
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Built with Patience. Destined to Age Gracefully.
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every garment and object in our collection originates in certified small-batch workshops across Italy, Scotland, and Japan. By bypassing distributor markups and seasonal discounting, we invest directly in master craftspeople, vegetable-tanned full-grain leathers, and ethical Mongolian cashmere.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-200 py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-200">
            <div className="space-y-3">
              <span className="text-lg font-bold text-stone-900 font-display uppercase tracking-tight">ATELIER</span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Minimalist apparel, leather goods, and ceramics designed with architectural restraint.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-3">Shop Collections</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setSelectedCategory('Apparel')} className="hover:text-stone-900 cursor-pointer">Cashmere & Merino Knitwear</button></li>
                <li><button onClick={() => setSelectedCategory('Footwear')} className="hover:text-stone-900 cursor-pointer">Strobel Stitch Sneakers</button></li>
                <li><button onClick={() => setSelectedCategory('Accessories')} className="hover:text-stone-900 cursor-pointer">Tuscan Leather Bags</button></li>
                <li><button onClick={() => setSelectedCategory('Lifestyle')} className="hover:text-stone-900 cursor-pointer">Artisanal Ceramic Wares</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-3">Customer Care</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setIsOrdersOpen(true)} className="hover:text-stone-900 cursor-pointer">Track Your Package</button></li>
                <li><button onClick={() => setIsOrdersOpen(true)} className="hover:text-stone-900 cursor-pointer">Order History & Receipts</button></li>
                <li><span className="text-stone-400">Carbon-Neutral Shipping</span></li>
                <li><span className="text-stone-400">30-Day Hassle-Free Returns</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 uppercase tracking-wider mb-3">Payment & Security</h4>
              <p className="text-stone-500 leading-relaxed">
                Protected by 256-bit SSL encryption. All transactions processed via Level 1 PCI-DSS compliant payment gateways with 3D Secure verification.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <p>© {new Date().getFullYear()} Atelier Minimalist Storefront. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Purchase</span>
              <span>·</span>
              <span>Security Audited</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        cart={cart}
        orders={orders}
        activeOrder={activeOrder}
        wishlistCount={wishlist.length}
        activeTab={mobileTab}
        onSelectTab={handleMobileTabSelect}
      />

      {/* PRODUCT DETAIL MODAL / SHEET */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        reviews={reviews}
        onAddReview={handleAddReview}
        userOrders={orders}
      />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistProductIds={wishlist}
        allProducts={PRODUCTS}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onMoveAllToCart={handleMoveAllToCart}
        onOpenProductDetail={(p) => setSelectedProduct(p)}
      />

      {/* SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setIsCheckoutOpen(true)}
        promoCode={promoCode}
        promoDiscountRate={promoDiscountRate}
        onApplyPromo={handleApplyPromo}
      />

      {/* SECURE CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        promoDiscountRate={promoDiscountRate}
        promoCode={promoCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* REAL-TIME ORDER TRACKING MODAL */}
      <OrderTrackingModal
        order={activeTrackingOrder}
        onClose={() => setIsTrackingOpen(false)}
        onUpdateOrder={handleUpdateOrder}
      />

      {/* ORDER HISTORY DRAWER */}
      <OrderHistoryDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onSelectOrder={(order) => {
          setActiveTrackingOrder(order);
          setIsTrackingOpen(true);
        }}
      />

    </div>
  );

  // If user enabled the Mobile Device Preview simulator on desktop
  if (isMobilePreview) {
    return (
      <div className="min-h-screen bg-stone-900 py-6 px-4 flex flex-col items-center justify-center">
        {/* Mobile Preview Top Control Bar */}
        <div className="w-full max-w-[420px] mb-3 flex items-center justify-between text-white text-xs px-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Mobile Device Simulator (iPhone 16 Pro)</span>
          </div>
          <button
            onClick={() => setIsMobilePreview(false)}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Exit to Desktop
          </button>
        </div>

        {/* Mobile Device Frame */}
        <div className="w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 relative overflow-hidden flex flex-col">
          {/* Dynamic Island / Speaker */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-stone-900/80 mr-3" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
          </div>

          {/* Screen area */}
          <div className="w-full h-full bg-stone-50 rounded-[38px] overflow-y-auto overflow-x-hidden relative">
            {appContent}
          </div>

          {/* Home indicator bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-600 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  return appContent;
}
