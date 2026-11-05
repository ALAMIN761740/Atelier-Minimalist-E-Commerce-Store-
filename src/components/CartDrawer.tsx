import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { CartItem } from '../types/ecommerce';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
  promoCode: string;
  promoDiscountRate: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  promoCode,
  promoDiscountRate,
  onApplyPromo
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(promoDiscountRate > 0);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * promoDiscountRate);
  const freeShippingThreshold = 150;
  const differenceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over panel */}
      <aside 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Shopping Bag
            </h2>
            <span className="text-xs text-stone-500 font-medium tabular-nums">
              ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 text-xs">
          <div className="flex justify-between items-center mb-1.5 font-medium">
            {differenceToFreeShipping === 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                You unlocked Complimentary Express Shipping!
              </span>
            ) : (
              <span className="text-stone-600">
                Add <strong className="text-stone-900">${differenceToFreeShipping}</strong> more for free express shipping
              </span>
            )}
            <span className="text-stone-400 tabular-nums">{freeShippingPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                freeShippingPercent >= 100 ? 'bg-emerald-600' : 'bg-stone-900'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <Tag className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="text-base font-semibold text-stone-700">Your bag is empty</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Explore our curated collection of luxury apparel, footwear, and lifestyle objects.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 flex gap-3.5 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>

                  {/* Selected variants */}
                  <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                    <span>Color: <strong className="font-medium text-stone-700">{item.selectedColor}</strong></span>
                    {item.selectedSize && (
                      <>
                        <span>·</span>
                        <span>Size: <strong className="font-medium text-stone-700">{item.selectedSize}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer text-xs font-bold"
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer text-xs font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions (Subtotal, Promo, Checkout) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3.5">
            {/* Promo Code Input */}
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Promo Code (SAVE15)"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs tracking-wider uppercase text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoError && (
              <p className="text-[11px] text-rose-600">{promoError}</p>
            )}
            {promoSuccess && (
              <p className="text-[11px] text-emerald-700 font-medium">
                ✓ Coupon code {promoCode || 'SAVE15'} active (15% off applied)
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-700 font-medium">Free</span>
                  ) : (
                    '$12 (or add $' + differenceToFreeShipping + ' for Free)'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-100">
                <span>Estimated Total</span>
                <span className="tabular-nums">
                  ${subtotal - discountAmount + (subtotal >= freeShippingThreshold ? 0 : 12)}
                </span>
              </div>
            </div>

            {/* Primary Mobile-Optimized Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full h-13 min-h-[48px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-lg shadow-stone-900/10"
            >
              <span>Quick Mobile Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted & PCI-DSS Secure</span>
            </div>
          </div>
        )}

      </aside>
    </div>
  );
};
