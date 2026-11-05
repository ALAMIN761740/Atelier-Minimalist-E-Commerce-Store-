import React, { useState } from 'react';
import { Heart, ShoppingBag, ArrowRight, Check, Trash2, Sparkles, Plus } from 'lucide-react';
import { Product } from '../types/ecommerce';

interface WishlistSectionProps {
  wishlistProductIds: string[];
  allProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product, color?: string, size?: string) => void;
  onMoveAllToCart: (products: Product[]) => void;
  onOpenProductDetail: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlistProductIds,
  allProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onOpenProductDetail,
  onExploreCatalog
}) => {
  const [movedMap, setMovedMap] = useState<{ [id: string]: boolean }>({});
  const [allMovedState, setAllMovedState] = useState(false);

  const wishlistProducts = allProducts.filter((p) => wishlistProductIds.includes(p.id));

  const handleMove = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveToCart(product);
    setMovedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setMovedMap((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }, 1500);
  };

  const handleMoveAll = () => {
    if (wishlistProducts.length === 0) return;
    onMoveAllToCart(wishlistProducts);
    setAllMovedState(true);
    setTimeout(() => setAllMovedState(false), 2000);
  };

  return (
    <section id="wishlist-section" className="py-8 sm:py-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest">
              Dedicated Wishlist
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
            Liked & Saved Essentials
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {wishlistProducts.length === 0
              ? 'No items saved yet'
              : `${wishlistProducts.length} ${wishlistProducts.length === 1 ? 'item' : 'items'} saved for later · Ready to move to bag`}
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleMoveAll}
              className={`px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                allMovedState ? 'bg-emerald-600' : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {allMovedState ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>All Items Moved to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move All ({wishlistProducts.length}) to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={() => wishlistProducts.forEach((p) => onRemoveFromWishlist(p.id))}
              className="px-3 py-2 text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-stone-200 mt-6 p-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 fill-rose-100 stroke-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mt-1.5 leading-relaxed">
            Tap the heart icon on any product in our catalog to save your favorite garments and artisanal objects here for quick 1-click cart purchases.
          </p>
          <button
            onClick={onExploreCatalog}
            className="mt-6 px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-all cursor-pointer shadow-sm"
          >
            Explore Featured Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {wishlistProducts.map((product) => {
            const isMoved = movedMap[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onOpenProductDetail(product)}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
              >
                {/* Visual Image */}
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Unlike Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-600 hover:bg-white transition-colors shadow-sm cursor-pointer z-10"
                    title="Remove from wishlist"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>

                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded tracking-wide">
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 uppercase tracking-wider mb-1 font-medium">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>★ {product.rating}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Direct Move to Cart CTA */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-stone-900 tabular-nums">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through tabular-nums">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {product.stock <= 8 ? `Only ${product.stock} left` : 'In stock'}
                      </span>
                    </div>

                    {/* Prominent Direct Move to Cart Button */}
                    <button
                      onClick={(e) => handleMove(product, e)}
                      className={`w-full h-11 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
                        isMoved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                      }`}
                    >
                      {isMoved ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Moved to Shopping Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Move Directly to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
