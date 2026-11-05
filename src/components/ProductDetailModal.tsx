import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types/ecommerce';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onInstantBuy: (product: Product, color: string, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const handleExpressBuy = () => {
    onInstantBuy(product, selectedColor, selectedSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop tap to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative bg-white w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
      >
        
        {/* Mobile Grab Bar */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 min-w-[36px] min-h-[36px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Main Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
            
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs px-2.5 py-1 rounded font-medium">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Trust markers under gallery */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-stone-500 text-[11px]">
                <div className="flex flex-col items-center gap-1 p-2 bg-stone-50 rounded-lg">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <span>Free Over $150</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-stone-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-stone-700" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-stone-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>2-Yr Warranty</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider font-medium mb-1.5">
                  <span>{product.category}</span>
                  <span>·</span>
                  <div className="flex items-center text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                    <span className="font-semibold text-stone-900">{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span className="text-stone-400 font-normal">{product.reviewsCount} verified reviews</span>
                </div>

                <h2 id="product-modal-title" className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="mt-2.5 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-stone-900 tabular-nums">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    In Stock ({product.stock} units)
                  </span>
                </div>

                <p className="text-sm text-stone-600 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Swatches */}
                <div className="mt-5">
                  <div className="flex justify-between items-center text-xs font-medium mb-2">
                    <span className="text-stone-700">Color Palette:</span>
                    <span className="text-stone-500 font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                          selectedColor === color.name ? 'border-stone-900 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-stone-300"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Options */}
                {product.sizes.length > 1 && (
                  <div className="mt-5">
                    <div className="flex justify-between items-center text-xs font-medium mb-2">
                      <span className="text-stone-700">Select Size:</span>
                      <span className="text-stone-400 underline cursor-pointer">Size Guide</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-10 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            selectedSize === size
                              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper */}
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-medium text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer text-sm font-semibold"
                    >
                      –
                    </button>
                    <span className="w-10 text-center text-xs font-semibold tabular-nums text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tabs / Accordion for Details */}
                <div className="mt-6 border-t border-stone-200 pt-4">
                  <div className="flex items-center gap-4 border-b border-stone-200 pb-2 text-xs font-medium">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`cursor-pointer transition-colors ${
                        activeTab === 'details' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Details & Fit
                    </button>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className={`cursor-pointer transition-colors ${
                        activeTab === 'materials' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Materials
                    </button>
                    <button
                      onClick={() => setActiveTab('shipping')}
                      className={`cursor-pointer transition-colors ${
                        activeTab === 'shipping' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Delivery & Returns
                    </button>
                  </div>
                  
                  <div className="py-3 text-xs text-stone-600 leading-relaxed min-h-[48px]">
                    {activeTab === 'details' && (
                      <p>{product.dimensions || 'Designed with relaxed modern proportions. Structured drape that fits true to size.'}</p>
                    )}
                    {activeTab === 'materials' && (
                      <p>{product.material}. Responsibly sourced and ethically crafted in artisan ateliers.</p>
                    )}
                    {activeTab === 'shipping' && (
                      <p>Complimentary carbon-neutral standard shipping on orders over $150. Easy 30-day return window with prepaid postal label included.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Desktop Desktop Actions (Hidden on mobile, mobile uses sticky bottom bar) */}
              <div className="hidden sm:grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-stone-200">
                <button
                  onClick={handleAdd}
                  disabled={addedAnimation}
                  className="h-12 rounded-xl bg-white border-2 border-stone-900 text-stone-900 font-medium text-sm flex items-center justify-center gap-2 hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExpressBuy}
                  className="h-12 rounded-xl bg-stone-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-98 transition-all cursor-pointer shadow-md"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Instant Checkout</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom CTA Bar (Adheres to 10_mobile_touch_apps.md Layout C) */}
        <div className="sm:hidden p-4 bg-white border-t border-stone-200 flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Total</span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">
              ${product.price * quantity}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 h-12 rounded-xl bg-stone-100 text-stone-900 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={handleExpressBuy}
            className="flex-1 h-12 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Quick Buy</span>
          </button>
        </div>

      </div>
    </div>
  );
};
