import React, { useState } from 'react';
import { 
  User as UserIcon, MapPin, Package, Heart, LogOut, 
  ShieldCheck, Check, Edit2, Sparkles, ShoppingBag 
} from 'lucide-react';
import { User, Order, PageRoute } from '../types/ecommerce';

interface ProfilePageProps {
  user: User | null;
  orders: Order[];
  wishlistCount: number;
  onLogout: () => void;
  onUpdateAddress: (address: any) => void;
  onNavigate: (page: PageRoute) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  orders,
  wishlistCount,
  onLogout,
  onUpdateAddress,
  onNavigate
}) => {
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-display">Client Sign-In Required</h2>
        <p className="text-xs text-stone-500">Sign in to view your Atelier profile, past orders, and saved addresses.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [street, setStreet] = useState(user.defaultAddress?.street || '450 Townsend St');
  const [city, setCity] = useState(user.defaultAddress?.city || 'San Francisco');
  const [state, setState] = useState(user.defaultAddress?.state || 'CA');
  const [postalCode, setPostalCode] = useState(user.defaultAddress?.postalCode || '94107');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAddress({
      ...user.defaultAddress,
      street,
      city,
      state,
      postalCode
    });
    setIsEditingAddress(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Profile Banner */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white flex items-center justify-center text-xl font-bold font-display shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
                {user.firstName} {user.lastName}
              </h1>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                {user.loyaltyTier}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-stone-400 mt-1 font-mono">
              Member since {new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-stone-50 transition-colors cursor-pointer self-start md:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 3 Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('orders')}
          className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-400 cursor-pointer transition-all shadow-xs space-y-2"
        >
          <div className="flex justify-between items-center text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Orders</span>
            <Package className="w-4 h-4" />
          </div>
          <span className="text-3xl font-extrabold text-stone-900 font-display tabular-nums">
            {orders.length}
          </span>
          <span className="text-xs text-stone-400 block">Click to view order tracking →</span>
        </div>

        <div 
          onClick={() => onNavigate('wishlist')}
          className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-400 cursor-pointer transition-all shadow-xs space-y-2"
        >
          <div className="flex justify-between items-center text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved in Wishlist</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-3xl font-extrabold text-stone-900 font-display tabular-nums">
            {wishlistCount}
          </span>
          <span className="text-xs text-stone-400 block">View favorite pieces →</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Membership Perks</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-sm font-bold text-stone-900 block pt-1">
            Complimentary Concierge Shipping
          </span>
          <span className="text-xs text-stone-400 block">30-day extended trial window</span>
        </div>
      </div>

      {/* Default Shipping Address Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 shadow-xs">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-stone-900" />
            <h3 className="text-base font-bold text-stone-900 font-display">
              Default Delivery Address
            </h3>
          </div>

          {!isEditingAddress ? (
            <button
              onClick={() => setIsEditingAddress(true)}
              className="text-xs font-semibold text-stone-900 hover:text-stone-700 underline cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Address</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditingAddress(false)}
              className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {savedSuccess && (
          <p className="text-xs text-emerald-700 font-medium">✓ Address updated successfully!</p>
        )}

        {!isEditingAddress ? (
          <div className="text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-900">{user.defaultAddress?.fullName || `${user.firstName} ${user.lastName}`}</p>
            <p>{street}</p>
            <p>{city}, {state} {postalCode}</p>
            <p className="text-stone-400 pt-1">Phone: {user.phone || '+1 (415) 890-4211'}</p>
          </div>
        ) : (
          <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Save Delivery Address
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
