import React from 'react';
import { ShoppingBag, Search, Compass, PackageCheck, Smartphone, Monitor, Heart } from 'lucide-react';
import { CartItem, Order } from '../types/ecommerce';

interface NavbarProps {
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: (order: Order) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  orders,
  activeOrder,
  wishlistCount,
  onOpenCart,
  onOpenOrders,
  onOpenWishlist,
  onOpenTracking,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  const [showSearchInput, setShowSearchInput] = React.useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide font-normal flex items-center justify-center gap-3">
        <span>Complimentary Express Delivery on orders over $150</span>
        <span className="hidden sm:inline text-stone-500">·</span>
        <span className="hidden sm:inline text-stone-400">Code: <strong className="text-white font-medium">SAVE15</strong> for 15% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                onSelectCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase font-display cursor-pointer hover:opacity-85 transition-opacity"
            >
              ATELIER
            </button>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-medium hidden md:inline">
              Edition 04
            </span>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {(['All', 'Apparel', 'Footwear', 'Accessories', 'Lifestyle'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                  selectedCategory === cat
                    ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                    : 'hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
            
            {/* Live Tracking link */}
            <button
              onClick={() => {
                if (activeOrder) {
                  onOpenTracking(activeOrder);
                } else if (orders.length > 0) {
                  onOpenTracking(orders[0]);
                } else {
                  onOpenOrders();
                }
              }}
              className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer py-1 flex items-center gap-1.5 text-stone-600"
            >
              <span>Live Tracking</span>
              {activeOrder && activeOrder.orderStatus !== 'delivered' && (
                <span className="w-2 h-2 rounded-full bg-emerald-600" title="Active Delivery in Progress" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary action zone (Search, Mobile Frame Toggle, Orders & Bag) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search toggler */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 transition-all w-48 sm:w-60">
                  <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search catalog..."
                    autoFocus
                    className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      onSearchChange('');
                    }}
                    className="text-stone-400 hover:text-stone-600 text-xs px-1"
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  title="Search products"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Desktop / Mobile Frame Preview Switcher */}
            <button
              onClick={onToggleMobilePreview}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
              title={isMobilePreview ? "Switch to Full Desktop View" : "Simulate Mobile Device Frame"}
            >
              {isMobilePreview ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-stone-700" />
                  <span className="whitespace-nowrap">Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-700" />
                  <span className="whitespace-nowrap">Mobile Frame</span>
                </>
              )}
            </button>

            {/* Wishlist shortcut button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              title={`Wishlist (${wishlistCount} saved items)`}
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-600 fill-rose-50' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Past orders shortcut button */}
            <button
              onClick={onOpenOrders}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              title="Order History & Tracking"
              aria-label="Order History"
            >
              <PackageCheck className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 rounded-full" />
              )}
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 active:scale-95 transition-all cursor-pointer shadow-sm"
              aria-label={`Shopping bag with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold tabular-nums">
                {totalCartCount}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
