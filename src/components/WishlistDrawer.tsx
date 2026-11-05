import React, { useState } from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Product } from '../types/ecommerce';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProductIds: string[];
  allProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product, color?: string, size?: string) => void;
  onMoveAllToCart: (products: Product[]) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProductIds,
  allProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onOpenProductDetail
}) => {
  if (!isOpen) return null;

  const [movedItemIds, setMovedItemIds] = useState<{ [id: string]: boolean }>({});
  const [allMoved, setAllMoved] = useState(false);

  // Filter products in wishlist
  const wishlistProducts = allProducts.filter((p) => wishlistProductIds.includes(p.id));

  const handleSingleMove = (product: Product) => {
    onMoveToCart(product);
    setMovedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setMovedItemIds((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }, 1500);
  };

  const handleMoveAll = () => {
    if (wishlistProducts.length === 0) return;
    onMoveAllToCart(wishlistProducts);
    setAllMoved(true);
    setTimeout(() => {
      setAllMoved(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop tap to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist Drawer"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                Saved Wishlist
              </h2>
              <span className="text-xs text-stone-500 font-medium tabular-nums">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'curated piece' : 'curated pieces'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <Heart className="w-7 h-7 stroke-1 text-stone-400" />
              </div>
              <h3 className="text-base font-semibold text-stone-800">Your wishlist is empty</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Save your favorite luxury knitwear, leather goods, and ceramics by tapping the heart icon on any product.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 cursor-pointer shadow-sm transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const isMoved = movedItemIds[product.id];

              return (
                <div key={product.id} className="py-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onOpenProductDetail(product);
                      onClose();
                    }}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 cursor-pointer group relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                          {product.category}
                        </span>
                        <h4
                          onClick={() => {
                            onOpenProductDetail(product);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-700 cursor-pointer truncate"
                        >
                          {product.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-stone-400 line-through tabular-nums">
                          ${product.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400 font-medium">
                        {product.stock <= 8 ? `Only ${product.stock} left` : 'In stock'}
                      </span>
                    </div>

                    {/* Move to Cart Action Button */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleSingleMove(product)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isMoved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95 shadow-xs'
                        }`}
                        aria-label={`Move ${product.name} to bag`}
                      >
                        {isMoved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Moved to Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onOpenProductDetail(product);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        Options
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            <button
              onClick={handleMoveAll}
              className={`w-full h-12 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 ${
                allMoved ? 'bg-emerald-600' : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {allMoved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>All Items Moved to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move All ({wishlistProducts.length}) to Bag</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1">
              <span>Items remain in wishlist for future re-orders</span>
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => onRemoveFromWishlist(p.id));
                }}
                className="text-stone-400 hover:text-rose-600 underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
