import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Heart, ShoppingBag, Zap, Truck, RotateCcw, 
  ShieldCheck, Check, Plus, Award, CheckCircle2, AlertCircle, ThumbsUp 
} from 'lucide-react';
import { Product, ProductReview, Order, PageRoute } from '../types/ecommerce';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product | null;
  allProducts: Product[];
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onInstantBuy: (product: Product, color: string, size: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
  reviews: ProductReview[];
  onAddReview: (reviewData: {
    productId: string;
    authorName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    recommended: boolean;
    fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
  }) => void;
  userOrders: Order[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onAddToCart,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist,
  onNavigate,
  onSelectProduct,
  reviews,
  onAddReview,
  userOrders
}) => {
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display">No product selected</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full cursor-pointer"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'reviews'>('details');
  const [addedToast, setAddedToast] = useState(false);

  // Review Form States
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formRecommended, setFormRecommended] = useState(true);
  const [formFit, setFormFit] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [simulatedVerified, setSimulatedVerified] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState<{ [id: string]: boolean }>({});

  const hasPurchased = userOrders.some(order => 
    order.items.some(item => item.product.id === product.id)
  );
  const isVerifiedCustomer = hasPurchased || simulatedVerified;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const totalReviews = productReviews.length;
  const avgRating = totalReviews > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : product.rating.toFixed(1);

  // Related products
  const related = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.rating >= 4.9))
    .slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a review headline.');
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 10) {
      setFormError('Please write at least 10 characters describing your experience.');
      return;
    }

    const defaultName = userOrders[0]?.shippingAddress.fullName || 'Verified Atelier Collector';
    onAddReview({
      productId: product.id,
      authorName: formAuthor.trim() || defaultName,
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      isVerifiedPurchase: true,
      recommended: formRecommended,
      fitRating: formFit
    });

    setIsWritingReview(false);
    setReviewSuccess(true);
    setFormTitle('');
    setFormComment('');
    setFormError('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Large Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs px-3 py-1 rounded-md font-medium">
                {product.tag}
              </span>
            )}
            <button
              onClick={(e) => onToggleWishlist(product.id, e)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-stone-600 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-stone-900" />
              <span className="font-semibold text-stone-900">Complimentary</span>
              <span className="text-[10px] text-stone-500">Orders over $150</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-stone-900" />
              <span className="font-semibold text-stone-900">30-Day Returns</span>
              <span className="text-[10px] text-stone-500">Prepaid label</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-stone-900" />
              <span className="font-semibold text-stone-900">2-Yr Guarantee</span>
              <span className="text-[10px] text-stone-500">Master repairs</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider font-medium mb-2">
              <span>{product.category}</span>
              <span>·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="flex items-center text-amber-600 hover:underline cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                <span className="font-semibold text-stone-900">{avgRating}</span>
                <span className="text-stone-400 ml-1">({totalReviews} reviews)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              {product.name}
            </h1>

            {/* Price Baseline */}
            <div className="mt-3 flex items-baseline gap-3">
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

            <p className="text-xs sm:text-sm text-stone-600 mt-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
              <span>Color Selection:</span>
              <span className="font-normal text-stone-500">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
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

          {/* Size Selector */}
          {product.sizes.length > 1 && (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                <span>Select Size:</span>
                <button
                  onClick={() => setActiveTab('details')}
                  className="text-stone-400 underline text-xs cursor-pointer"
                >
                  Fit Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-stone-900 text-white border-stone-900'
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
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-700">Quantity:</span>
            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer text-sm font-semibold"
              >
                –
              </button>
              <span className="w-10 text-center text-xs font-semibold tabular-nums text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer text-sm font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="h-12 rounded-xl bg-white border-2 border-stone-900 text-stone-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={() => onInstantBuy(product, selectedColor, selectedSize, quantity)}
              className="h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Instant Checkout</span>
            </button>
          </div>

          {/* Specifications Tabs */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-2 text-xs font-medium">
              <button
                onClick={() => setActiveTab('details')}
                className={`cursor-pointer pb-1 transition-colors ${
                  activeTab === 'details' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Details & Fit
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`cursor-pointer pb-1 transition-colors ${
                  activeTab === 'materials' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Materials
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`cursor-pointer pb-1 transition-colors ${
                  activeTab === 'shipping' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Delivery & Returns
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`cursor-pointer pb-1 transition-colors ${
                  activeTab === 'reviews' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Reviews ({totalReviews})
              </button>
            </div>

            <div className="py-3 text-xs text-stone-600 leading-relaxed min-h-[56px]">
              {activeTab === 'details' && (
                <p>{product.dimensions || 'Designed with relaxed modern proportions. Structured drape that fits true to size.'}</p>
              )}
              {activeTab === 'materials' && (
                <p>{product.material}. Responsibly sourced and ethically crafted in artisan ateliers.</p>
              )}
              {activeTab === 'shipping' && (
                <p>Complimentary carbon-neutral standard shipping on orders over $150. Easy 30-day return window with prepaid postal label included.</p>
              )}
              {activeTab === 'reviews' && (
                <p>Scroll below to read full verified reviews or submit your own collector feedback.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* FULL VERIFIED CUSTOMER REVIEWS SECTION */}
      <section className="pt-10 border-t border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <span className="text-4xl font-extrabold text-stone-900 font-display tabular-nums">
                {avgRating}
              </span>
              <div className="flex items-center justify-center text-amber-500 mt-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                {totalReviews} verified ratings
              </span>
            </div>

            <div className="hidden sm:block w-px h-16 bg-stone-200" />

            <div className="space-y-1 text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Verified Customer Authenticity
              </span>
              <p className="text-stone-500 text-[11px]">
                Reviews can only be submitted by verified purchasers with confirmed order delivery.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isWritingReview ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Success Confirmation */}
        {reviewSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Thank you! Your verified review has been published.</span>
          </div>
        )}

        {/* Review Form */}
        {isWritingReview && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 bg-white rounded-2xl border-2 border-stone-900 space-y-4 shadow-lg animate-in slide-in-from-top-2"
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 font-display">Write a Verified Review</h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                VERIFIED BUYER
              </span>
            </div>

            {!hasPurchased && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>You haven't ordered this item in your current session.</span>
                <button
                  type="button"
                  onClick={() => setSimulatedVerified(!simulatedVerified)}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 font-medium rounded text-[11px] cursor-pointer"
                >
                  {simulatedVerified ? '✓ Simulated as Verified Buyer' : 'Enable Verified Buyer for Testing'}
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">Your Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setFormHoverRating(star)}
                    onMouseLeave={() => setFormHoverRating(0)}
                    onClick={() => setFormRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (formHoverRating || formRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Headline</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Unparalleled softness and beautiful ribbing"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Written Review</label>
              <textarea
                rows={3}
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="Describe the fabric weight, drape, durability, and craftsmanship..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 outline-none focus:border-stone-900"
              />
            </div>

            {formError && <p className="text-xs text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWritingReview(false)}
                className="px-4 py-2 border rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isVerifiedCustomer}
                className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {productReviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl border border-stone-200 bg-white space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      ✓ Verified Purchaser
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400 font-mono">{rev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-stone-900">{rev.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              
              <div className="pt-2 text-[11px] text-stone-500 flex justify-between items-center">
                <span>{rev.authorName} {rev.fitRating ? `· Fit: ${rev.fitRating}` : ''}</span>
                <button
                  onClick={() => setHelpfulVotes(prev => ({ ...prev, [rev.id]: !prev[rev.id] }))}
                  className="flex items-center gap-1 hover:text-stone-900 cursor-pointer text-stone-500"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount + (helpfulVotes[rev.id] ? 1 : 0)})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Complete the Wardrobe</span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display mt-1">
              Complementary Atelier Pieces
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {related.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onSelect={(p) => onSelectProduct(p)}
                onQuickAdd={(p, e) => onAddToCart(p, p.colors[0]?.name || 'Standard', p.sizes[0] || 'Standard', 1)}
                isWishlisted={false}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
