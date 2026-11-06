import React from 'react';
import { Home, Heart, ShoppingBag, Grid, User as UserIcon } from 'lucide-react';
import { CartItem, Order, PageRoute } from '../types/ecommerce';

interface MobileBottomNavProps {
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  wishlistCount: number;
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cart,
  orders,
  activeOrder,
  wishlistCount,
  currentPage,
  onNavigate,
  onOpenCart,
}) => {
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasActiveTracking = activeOrder && activeOrder.orderStatus !== 'delivered';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-2 py-1.5 shadow-lg lg:hidden"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {/* Tab 1: Home / Shop */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            currentPage === 'home' || currentPage === 'shop'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Home and Catalog"
        >
          <Home
            className={`w-5 h-5 ${
              currentPage === 'home' || currentPage === 'shop'
                ? 'stroke-[2.2]'
                : 'stroke-[1.6]'
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            currentPage === 'categories'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Product Categories"
        >
          <Grid
            className={`w-5 h-5 ${
              currentPage === 'categories' ? 'stroke-[2.2]' : 'stroke-[1.6]'
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
        </button>

        {/* Tab 3: Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            currentPage === 'wishlist'
              ? 'text-rose-600 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label={`Wishlist with ${wishlistCount} saved items`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                currentPage === 'wishlist'
                  ? 'fill-rose-500 stroke-rose-600'
                  : 'stroke-[1.6]'
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Saved</span>
        </button>

        {/* Tab 4: Bag */}
        <button
          onClick={onOpenCart}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            currentPage === 'cart'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label={`Shopping bag with ${cartItemCount} items`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 ${
                currentPage === 'cart' ? 'stroke-[2.2]' : 'stroke-[1.6]'
              }`}
            />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
        </button>

        {/* Tab 5: Account & Orders */}
        <button
          onClick={() => onNavigate('profile')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            currentPage === 'profile' || currentPage === 'orders' || currentPage === 'login'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Customer Profile and Orders"
        >
          <div className="relative">
            <UserIcon
              className={`w-5 h-5 ${
                currentPage === 'profile' || currentPage === 'orders'
                  ? 'stroke-[2.2]'
                  : 'stroke-[1.6]'
              }`}
            />
            {hasActiveTracking && (
              <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
            {!hasActiveTracking && orders.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-stone-200 text-stone-700 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center tabular-nums">
                {orders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
