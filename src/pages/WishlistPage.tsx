import React from 'react';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, PageRoute } from '../types/ecommerce';
import { WishlistSection } from '../components/WishlistSection';

interface WishlistPageProps {
  wishlist: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product, color?: string, size?: string) => void;
  onMoveAllToCart: (products: Product[]) => void;
  onOpenProductDetail: (product: Product) => void;
  onNavigate: (page: PageRoute) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  products,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onOpenProductDetail,
  onNavigate
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Render full Wishlist Section */}
      <WishlistSection
        wishlistProductIds={wishlist}
        allProducts={products}
        onRemoveFromWishlist={onRemoveFromWishlist}
        onMoveToCart={onMoveToCart}
        onMoveAllToCart={onMoveAllToCart}
        onOpenProductDetail={onOpenProductDetail}
        onExploreCatalog={() => onNavigate('shop')}
      />

    </div>
  );
};
