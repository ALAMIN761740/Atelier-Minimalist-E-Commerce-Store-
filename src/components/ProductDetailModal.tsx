import React, { useState, useMemo } from 'react';
import { 
  X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Zap, 
  ThumbsUp, MessageSquare, Plus, Award, AlertCircle, Sparkles, CheckCircle2 
} from 'lucide-react';
import { Product, ProductReview, Order } from '../types/ecommerce';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onInstantBuy: (product: Product, color: string, size: string, quantity: number) => void;
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
  reviews,
  onAddReview,
  userOrders
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'reviews'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);

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
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Helpful reviews vote state
  const [helpfulVotes, setHelpfulVotes] = useState<{ [id: string]: boolean }>({});

  // Check if current user is a verified purchaser
  const hasPurchased = useMemo(() => {
    return userOrders.some(order => 
      order.items.some(item => item.product.id === product.id)
    );
  }, [userOrders, product.id]);

  const isVerifiedCustomer = hasPurchased || simulatedVerified;

  // Filter reviews for this specific product
  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === product.id);
  }, [reviews, product.id]);

  // Dynamic rating calculations
  const totalReviewsCount = productReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : product.rating.toFixed(1);

  // Rating breakdown percentages
  const ratingCounts = useMemo(() => {
    const counts: { [star: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [productReviews]);

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

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
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
    const authorName = formAuthor.trim() || defaultName;

    onAddReview({
      productId: product.id,
      authorName,
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      isVerifiedPurchase: true,
      recommended: formRecommended,
      fitRating: formFit
    });

    // Reset and show success banner
    setIsWritingReview(false);
    setReviewSubmitSuccess(true);
    setFormTitle('');
    setFormComment('');
    setFormError('');
    setTimeout(() => {
      setReviewSubmitSuccess(false);
    }, 4000);
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
        className="relative bg-white w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
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
                {/* Category & Rating Clickable to Reviews Tab */}
                <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider font-medium mb-1.5">
                  <span>{product.category}</span>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center text-amber-600 hover:text-amber-700 cursor-pointer group"
                    title="Jump to verified customer reviews"
                  >
                    <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                    <span className="font-semibold text-stone-900 group-hover:underline">{averageRating}</span>
                    <span className="text-stone-400 font-normal ml-1">({totalReviewsCount} reviews)</span>
                  </button>
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

                {/* Tabs for Details, Materials, Delivery & REVIEWS */}
                <div className="mt-6 border-t border-stone-200 pt-4">
                  <div className="flex items-center gap-4 border-b border-stone-200 pb-2 text-xs font-medium overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
                        activeTab === 'details' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Details & Fit
                    </button>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
                        activeTab === 'materials' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Materials
                    </button>
                    <button
                      onClick={() => setActiveTab('shipping')}
                      className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
                        activeTab === 'shipping' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      Delivery & Returns
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`cursor-pointer transition-colors whitespace-nowrap pb-1 flex items-center gap-1.5 ${
                        activeTab === 'reviews' ? 'text-stone-900 border-b-2 border-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      <span>Reviews</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 rounded-full text-stone-700 font-bold tabular-nums">
                        {totalReviewsCount}
                      </span>
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

              {/* Desktop Actions */}
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

          {/* DEDICATED REVIEWS SECTION (ACTIVE WHEN REVIEWS TAB IS SELECTED OR SCROLLED) */}
          {activeTab === 'reviews' && (
            <div className="mt-8 pt-8 border-t border-stone-200 space-y-6">
              
              {/* Reviews Header & Scorecard */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display tabular-nums">
                      {averageRating}
                    </span>
                    <div className="flex items-center justify-center text-amber-500 mt-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Based on {totalReviewsCount} reviews
                    </span>
                  </div>

                  <div className="hidden sm:block w-px h-16 bg-stone-200" />

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        100% Verified Customer Reviews
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px]">
                      Only purchasers with confirmed delivery orders may submit verified ratings.
                    </p>
                  </div>
                </div>

                {/* Write a Review Button */}
                <div>
                  {!isWritingReview ? (
                    <button
                      onClick={() => setIsWritingReview(true)}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsWritingReview(false)}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Cancel Form
                    </button>
                  )}
                </div>
              </div>

              {/* Review Success Confirmation Toast */}
              {reviewSubmitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    Thank you! Your verified review has been published and added to this product's rating.
                  </span>
                </div>
              )}

              {/* WRITE A REVIEW FORM */}
              {isWritingReview && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-stone-900 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-stone-900" />
                      <h3 className="text-sm font-bold text-stone-900 font-display">
                        Verified Customer Review Form
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      VERIFIED BUYER
                    </span>
                  </div>

                  {/* Verification Status Notice & Demo Switch */}
                  {!hasPurchased && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>You haven't ordered this item in your current session.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSimulatedVerified(!simulatedVerified)}
                        className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-medium rounded-md text-[11px] cursor-pointer transition-colors"
                      >
                        {simulatedVerified ? '✓ Simulated as Verified Buyer' : 'Enable Verified Buyer for Testing'}
                      </button>
                    </div>
                  )}

                  {/* Star Rating Interactive Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                      Your Overall Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setFormHoverRating(star)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          onClick={() => setFormRating(star)}
                          className="p-1 text-stone-300 hover:text-amber-500 transition-colors cursor-pointer"
                          aria-label={`${star} Stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (formHoverRating || formRating) >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-medium text-stone-600 ml-2">
                        {formRating === 5 ? '5 - Exceptional' :
                         formRating === 4 ? '4 - Very Good' :
                         formRating === 3 ? '3 - Average' :
                         formRating === 2 ? '2 - Fair' : '1 - Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Unparalleled softness and beautiful ribbing"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 outline-none focus:border-stone-900 bg-stone-50/50"
                    />
                  </div>

                  {/* Reviewer Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Your Name / Display Alias
                      </label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder={userOrders[0]?.shippingAddress.fullName || "Elena R."}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 outline-none focus:border-stone-900 bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1">
                        Fit Feedback
                      </label>
                      <select
                        value={formFit}
                        onChange={(e) => setFormFit(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 outline-none focus:border-stone-900 bg-stone-50/50 cursor-pointer"
                      >
                        <option value="True to Size">True to Size (Recommended)</option>
                        <option value="Runs Small">Runs Slightly Small</option>
                        <option value="Runs Large">Runs Slightly Oversized</option>
                      </select>
                    </div>
                  </div>

                  {/* Review Comment Body */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-1">
                      Written Review
                    </label>
                    <textarea
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Share your experience regarding the materials, weight, longevity, and craftsmanship..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 outline-none focus:border-stone-900 bg-stone-50/50 leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[11px] text-stone-400 mt-0.5">
                      <span>Minimum 10 characters</span>
                      <span>{formComment.length} characters</span>
                    </div>
                  </div>

                  {/* Recommendation Checkbox */}
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formRecommended}
                      onChange={(e) => setFormRecommended(e.target.checked)}
                      className="rounded text-stone-900"
                    />
                    <span>I recommend this product to other collectors</span>
                  </label>

                  {formError && (
                    <p className="text-xs text-rose-600 font-medium">{formError}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isVerifiedCustomer}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Submit Verified Review
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF REVIEWS */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Customer Experiences ({productReviews.length})
                </h4>

                {productReviews.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    <p className="font-semibold text-stone-800">No customer reviews yet for this piece.</p>
                    <p className="mt-1">Be the first verified customer to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productReviews.map((rev) => {
                      const isVotedHelpful = helpfulVotes[rev.id];
                      const helpfulTotal = rev.helpfulCount + (isVotedHelpful ? 1 : 0);

                      return (
                        <div
                          key={rev.id}
                          className="p-4 sm:p-5 rounded-xl border border-stone-200/90 bg-white space-y-2.5 text-left"
                        >
                          {/* Rating & Verified Badge Row */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center text-amber-500">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= rev.rating ? 'fill-current' : 'text-stone-200'
                                    }`}
                                  />
                                ))}
                              </div>

                              {rev.isVerifiedPurchase && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Verified Purchaser
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] font-mono text-stone-400">
                              {rev.date}
                            </span>
                          </div>

                          {/* Review Headline */}
                          <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                            {rev.title}
                          </h5>

                          {/* Review Body */}
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {rev.comment}
                          </p>

                          {/* Metadata: Author, Fit, Recommendation, Helpful Button */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-stone-800">{rev.authorName}</span>
                              {rev.fitRating && (
                                <>
                                  <span>·</span>
                                  <span>Fit: <strong className="text-stone-700">{rev.fitRating}</strong></span>
                                </>
                              )}
                              {rev.recommended && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-700 font-medium">✓ Recommends item</span>
                                </>
                              )}
                            </div>

                            {/* Helpful Counter Button */}
                            <button
                              onClick={() => handleHelpfulClick(rev.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                isVotedHelpful
                                  ? 'bg-stone-900 text-white'
                                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                              }`}
                              aria-label="Vote this review helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful ({helpfulTotal})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

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
