import React, { useState } from 'react';
import { ShoppingBag, Search, PackageCheck, Smartphone, Monitor, Heart, User as UserIcon } from 'lucide-react';
import { CartItem, Order, User, PageRoute } from '../types/ecommerce';

interface NavbarProps {
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  wishlistCount: number;
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  user: User | null;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: (order: Order) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  orders,
  activeOrder,
  wishlistCount,
  currentPage,
  onNavigate,
  user,
  onOpenCart,
  onOpenOrders,
  onOpenWishlist,
  onOpenTracking,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isMobilePreview,
  onToggleMobilePreview,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      } else {
        onNavigate('search');
      }
      setShowSearchInput(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide font-normal flex items-center justify-center gap-3">
        <span>Complimentary Express Delivery on orders over $150</span>
        <span className="hidden sm:inline text-stone-500">·</span>
        <span className="hidden sm:inline text-stone-400">
          Code: <strong className="text-white font-medium">SAVE15</strong> for 15% off
        </span>
        <span className="hidden md:inline text-stone-500">·</span>
        <button
          onClick={() => onNavigate('faq')}
          className="hidden md:inline text-stone-400 hover:text-white underline cursor-pointer text-xs"
        >
          Customer Concierge FAQ
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase font-serif cursor-pointer hover:opacity-85 transition-opacity"
            >
              ATELIER
            </button>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium hidden md:inline border-l border-stone-200 pl-3">
              Edition 04
            </span>
          </div>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors cursor-pointer py-1 ${
                currentPage === 'home' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onSelectCategory('All');
                onNavigate('shop');
              }}
              className={`transition-colors cursor-pointer py-1 ${
                currentPage === 'shop' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`transition-colors cursor-pointer py-1 ${
                currentPage === 'categories' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors cursor-pointer py-1 ${
                currentPage === 'about' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors cursor-pointer py-1 ${
                currentPage === 'contact' ? 'text-stone-900 border-b-2 border-stone-900' : 'hover:text-stone-900'
              }`}
            >
              Concierge
            </button>

            {/* Live Tracking Link */}
            <button
              onClick={() => {
                if (activeOrder) {
                  onOpenTracking(activeOrder);
                } else if (orders.length > 0) {
                  onOpenTracking(orders[0]);
                } else {
                  onNavigate('orders');
                }
              }}
              className="hover:text-stone-900 transition-colors cursor-pointer py-1 flex items-center gap-1.5 normal-case tracking-normal font-medium text-stone-600"
            >
              <span>Live Tracking</span>
              {activeOrder && activeOrder.orderStatus !== 'delivered' && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" title="Active Delivery in Progress" />
              )}
            </button>
          </nav>

          {/* Action Zone: Search, Mobile Toggle, Wishlist, Orders, Account, Bag */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search toggler */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 transition-all w-48 sm:w-60 border border-stone-200">
                  <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Press enter to search..."
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
              title={isMobilePreview ? 'Switch to Full Desktop View' : 'Simulate Mobile Device Frame'}
            >
              {isMobilePreview ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-stone-700" />
                  <span className="whitespace-nowrap">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-700" />
                  <span className="whitespace-nowrap">Mobile Frame</span>
                </>
              )}
            </button>

            {/* Wishlist button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              title={`Wishlist (${wishlistCount} saved items)`}
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-600 fill-rose-50' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Order history shortcut button */}
            <button
              onClick={() => onNavigate('orders')}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              title="Order History & Tracking"
              aria-label="Order History"
            >
              <PackageCheck className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 rounded-full" />
              )}
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={() => onNavigate(user ? 'profile' : 'login')}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer relative"
              title={user ? `Signed in as ${user.firstName} ${user.lastName}` : 'Sign In / Account'}
              aria-label="Customer Account"
            >
              {user ? (
                <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-[10px] font-semibold">
                  {user.firstName.charAt(0)}
                </div>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 active:scale-95 transition-all cursor-pointer shadow-xs ml-1"
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
