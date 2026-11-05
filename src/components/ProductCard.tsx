import React from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '../types/ecommerce';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [addedRecently, setAddedRecently] = React.useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, e);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1400);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Visual Slot (65-75% height) with Fallback Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        {/* Fallback pattern while loading or on error */}
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400">
          <span className="text-xs uppercase tracking-widest font-mono">ATELIER</span>
        </div>

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-3 right-3 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-rose-600 transition-colors shadow-sm cursor-pointer z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Clean Editorial Tag (if present) */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded tracking-wide backdrop-blur-xs">
            {product.tag}
          </div>
        )}

        {/* Quick Add Overlay on Hover / Mobile persistent affordance */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={handleQuickAddClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all shadow-md cursor-pointer ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95'
            }`}
            aria-label={`Quick add ${product.name} to cart`}
          >
            {addedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          {/* Clean unboxed metadata with dot separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 uppercase tracking-wider mb-1 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>★ {product.rating}</span>
            <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Stock Baseline */}
        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
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
      </div>
    </div>
  );
};
