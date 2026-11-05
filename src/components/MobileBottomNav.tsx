import React from 'react';
import { Home, Search, ShoppingBag, Truck, Clock } from 'lucide-react';
import { CartItem, Order } from '../types/ecommerce';

interface MobileBottomNavProps {
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  activeTab: 'shop' | 'search' | 'bag' | 'tracking' | 'orders';
  onSelectTab: (tab: 'shop' | 'search' | 'bag' | 'tracking' | 'orders') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cart,
  orders,
  activeOrder,
  activeTab,
  onSelectTab
}) => {
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasActiveTracking = activeOrder && activeOrder.orderStatus !== 'delivered';

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 shadow-lg md:hidden"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* Tab 1: Shop */}
        <button
          onClick={() => onSelectTab('shop')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'shop' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Storefront"
        >
          <Home className={`w-5 h-5 ${activeTab === 'shop' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Shop</span>
        </button>

        {/* Tab 2: Search */}
        <button
          onClick={() => onSelectTab('search')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'search' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Search and Filter"
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
        </button>

        {/* Tab 3: Bag */}
        <button
          onClick={() => onSelectTab('bag')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'bag' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label={`Shopping bag with ${cartItemCount} items`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'bag' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
        </button>

        {/* Tab 4: Live Tracking */}
        <button
          onClick={() => onSelectTab('tracking')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'tracking' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Live Order Tracking"
        >
          <div className="relative">
            <Truck className={`w-5 h-5 ${activeTab === 'tracking' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            {hasActiveTracking && (
              <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Track</span>
        </button>

        {/* Tab 5: Orders */}
        <button
          onClick={() => onSelectTab('orders')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-lg transition-colors cursor-pointer ${
            activeTab === 'orders' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Orders History"
        >
          <div className="relative">
            <Clock className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-stone-200 text-stone-700 text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center tabular-nums">
                {orders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Orders</span>
        </button>

      </div>
    </nav>
  );
};
