import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles, 
  Truck, ArrowLeft, Lock 
} from 'lucide-react';
import { CartItem, PageRoute } from '../types/ecommerce';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onNavigate: (page: PageRoute) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  promoDiscountRate: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onProceedToCheckout,
  promoCode,
  promoDiscountRate,
  onApplyPromo
}) => {
  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(promoDiscountRate > 0);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * promoDiscountRate);
  const freeShippingThreshold = 150;
  const differenceToFree = Math.max(0, freeShippingThreshold - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
  const tax = Math.round((subtotal - discountAmount) * 0.0825);
  const total = subtotal - discountAmount + shippingCost + tax;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = onApplyPromo(inputCode.trim());
    if (ok) {
      setPromoSuccess(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "SAVE15" for 15% off.');
      setPromoSuccess(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h2 className="text-2xl font-bold font-display text-stone-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-2 leading-relaxed">
          Discover our permanent catalog of cashmere knitwear, Tuscan leathers, and studio ceramics.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-6 px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-sm"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            Order Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
        </div>

        <button
          onClick={() => onNavigate('shop')}
          className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2 text-xs">
        <div className="flex justify-between items-center font-medium">
          {differenceToFree === 0 ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              You unlocked Complimentary Express Courier Delivery!
            </span>
          ) : (
            <span className="text-stone-600">
              Add <strong className="text-stone-900">${differenceToFree}</strong> more to unlock Free Express Courier
            </span>
          )}
          <span className="text-stone-400 font-mono">{freePercent}%</span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              freePercent >= 100 ? 'bg-emerald-600' : 'bg-stone-900'
            }`}
            style={{ width: `${freePercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Itemized List + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900">
                        {item.product.name}
                      </h3>
                    </div>

                    <span className="text-base font-bold text-stone-900 tabular-nums">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span>Color: <strong className="text-stone-800">{item.selectedColor}</strong></span>
                    {item.selectedSize && (
                      <>
                        <span>·</span>
                        <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove Action */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-50">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer font-bold"
                      >
                        –
                      </button>
                      <span className="w-10 text-center text-xs font-semibold tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 flex items-center gap-1 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 font-display">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handlePromoSubmit} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Promo Code (SAVE15)"
                  className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs uppercase font-mono tracking-wider outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
              {promoSuccess && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Code {promoCode || 'SAVE15'} active (15% discount applied)
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">${subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount (15%)</span>
                  <span className="tabular-nums">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="tabular-nums">
                  {shippingCost === 0 ? <span className="text-emerald-700 font-semibold">Free</span> : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="tabular-nums">${tax}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-base pt-3 border-t border-stone-200">
                <span>Estimated Total</span>
                <span className="tabular-nums">${total}</span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={onProceedToCheckout}
              className="w-full h-13 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-lg shadow-stone-900/10"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Secure Checkout</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted & PCI-DSS Secure</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
