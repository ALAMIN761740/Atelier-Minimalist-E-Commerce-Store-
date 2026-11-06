import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { PRODUCTS, DEMO_USER } from './data/products';
import { INITIAL_REVIEWS } from './data/reviews';
import { 
  Product, CartItem, Order, ProductReview, User, PageRoute, 
  ToastNotification, ContactMessage 
} from './types/ecommerce';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderHistoryDrawer } from './components/OrderHistoryDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';

// 16 Full Dedicated Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  // Page Routing State with Hash Synchronization
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    try {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validPages: PageRoute[] = [
        'home', 'shop', 'product-detail', 'categories', 'search',
        'cart', 'wishlist', 'checkout', 'login', 'register',
        'profile', 'orders', 'about', 'contact', 'faq', '404'
      ];
      return validPages.includes(hash) ? hash : 'home';
    } catch {
      return 'home';
    }
  });

  // User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('atelier_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'prod-01-Oatmeal Heather-M',
          product: PRODUCTS[0],
          quantity: 1,
          selectedColor: 'Oatmeal Heather',
          selectedSize: 'M'
        }
      ];
    } catch {
      return [];
    }
  });

  // Order Ledger State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Array of Product IDs)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : ['prod-02'];
    } catch {
      return [];
    }
  });

  // Customer Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_product_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // In-App Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Filtering, Searching, & Product Detail Selection
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Quick-Slide Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('SAVE15');
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0.15);

  // Mobile Device Simulator Preview
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Helper to add toast messages
  const addToast = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...notification, id };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Navigation Handler with Hash Sync & Smooth Scroll to Top
  const navigateTo = useCallback((page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Hashchange listener for Browser Back/Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validPages: PageRoute[] = [
        'home', 'shop', 'product-detail', 'categories', 'search',
        'cart', 'wishlist', 'checkout', 'login', 'register',
        'profile', 'orders', 'about', 'contact', 'faq', '404'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // LocalStorage synchronizations
  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_product_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('atelier_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('atelier_user');
    }
  }, [user]);

  // Active tracking order calculation
  const activeOrder = useMemo(() => {
    return orders.find((o) => o.orderStatus !== 'delivered') || orders[0] || null;
  }, [orders]);

  // Cart Handlers
  const handleAddToCart = useCallback((
    product: Product, 
    color: string, 
    size: string, 
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const cartItemId = `${product.id}-${color}-${size}`;
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        { id: cartItemId, product, quantity, selectedColor: color, selectedSize: size }
      ];
    });

    addToast({
      title: 'Added to Bag',
      message: `${quantity}× ${product.name} (${color}, ${size}) added.`,
      type: 'success',
      duration: 3500
    });
  }, [addToast]);

  const handleQuickAdd = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const color = product.colors[0]?.name || 'Standard';
    const size = product.sizes[0] || 'Standard';
    handleAddToCart(product, color, size, 1);
  }, [handleAddToCart]);

  const handleUpdateCartQuantity = useCallback((cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  }, []);

  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast({
      title: 'Item Removed',
      message: 'Item has been removed from your shopping bag.',
      type: 'info',
      duration: 2500
    });
  }, [addToast]);

  const handleInstantBuy = useCallback((
    product: Product, 
    color: string, 
    size: string, 
    quantity: number
  ) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  }, [handleAddToCart]);

  // Wishlist Handlers
  const handleToggleWishlist = useCallback((productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      if (isSaved) {
        addToast({
          title: 'Removed from Wishlist',
          message: `${product?.name || 'Item'} removed from saved items.`,
          type: 'info',
          duration: 2500
        });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({
          title: 'Saved to Wishlist',
          message: `${product?.name || 'Item'} added to your saved collection.`,
          type: 'success',
          duration: 2500
        });
        return [...prev, productId];
      }
    });
  }, [addToast]);

  const handleRemoveFromWishlist = useCallback((productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast({
      title: 'Removed from Wishlist',
      message: `${product?.name || 'Item'} removed.`,
      type: 'info',
      duration: 2500
    });
  }, [addToast]);

  const handleMoveToCart = useCallback((product: Product, color?: string, size?: string) => {
    const selectedColor = color || product.colors[0]?.name || 'Standard';
    const selectedSize = size || product.sizes[0] || 'Standard';
    handleAddToCart(product, selectedColor, selectedSize, 1);
  }, [handleAddToCart]);

  const handleMoveAllToCart = useCallback((productsToMove: Product[]) => {
    productsToMove.forEach((product) => {
      const selectedColor = product.colors[0]?.name || 'Standard';
      const selectedSize = product.sizes[0] || 'Standard';
      handleAddToCart(product, selectedColor, selectedSize, 1);
    });
    addToast({
      title: 'Items Moved to Bag',
      message: `${productsToMove.length} items moved to your shopping bag.`,
      type: 'success',
      duration: 3500
    });
    setIsCartOpen(true);
  }, [handleAddToCart, addToast]);

  // Review Submissions
  const handleAddReview = useCallback((reviewData: {
    productId: string;
    authorName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    recommended: boolean;
    fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
  }) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      helpfulCount: 0,
      ...reviewData
    };

    setReviews((prev) => [newReview, ...prev]);
    addToast({
      title: 'Review Published',
      message: 'Thank you for sharing your verified product experience.',
      type: 'success',
      duration: 4000
    });
  }, [addToast]);

  // Promo Engine
  const handleApplyPromo = useCallback((code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'SAVE15') {
      setPromoCode('SAVE15');
      setPromoDiscountRate(0.15);
      addToast({
        title: 'Promotion Applied',
        message: '15% discount applied with code SAVE15.',
        type: 'success',
        duration: 3000
      });
      return true;
    } else if (cleaned === 'FREESHIP' || cleaned === 'VIP20') {
      setPromoCode(cleaned);
      setPromoDiscountRate(0.20);
      addToast({
        title: 'VIP Promotion Applied',
        message: '20% discount applied with code VIP20.',
        type: 'success',
        duration: 3000
      });
      return true;
    }
    addToast({
      title: 'Invalid Promo Code',
      message: 'Please check the code and try again (try SAVE15 or VIP20).',
      type: 'error',
      duration: 3000
    });
    return false;
  }, [addToast]);

  // Order Placement
  const handleOrderSuccess = useCallback((newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(newOrder);
    setIsTrackingOpen(true);
    addToast({
      title: 'Order Confirmed',
      message: `Order #${newOrder.orderId} placed successfully. Express dispatch started.`,
      type: 'success',
      duration: 5000
    });
  }, [addToast]);

  // Live Tracking Simulator Order Update
  const handleUpdateOrder = useCallback((updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o))
    );
    setActiveTrackingOrder(updatedOrder);
  }, []);

  // Concierge Contact Message Handler
  const handleSendMessage = useCallback((msg: ContactMessage) => {
    addToast({
      title: 'Inquiry Received',
      message: `Thank you ${msg.name}. Your inquiry #${msg.id} is with our San Francisco concierge team.`,
      type: 'success',
      duration: 5000
    });
  }, [addToast]);

  // Product Selection (PDP or Modal)
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigateTo('product-detail');
  }, [navigateTo]);

  // Search Dispatcher
  const handleSearchSubmit = useCallback((query: string) => {
    setSearchQuery(query);
    navigateTo('search');
  }, [navigateTo]);

  // Render Active Page
  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigateTo}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo('shop');
            }}
          />
        );

      case 'shop':
        return (
          <ShopPage
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        );

      case 'product-detail':
        const activeProduct = selectedProduct || PRODUCTS[0];
        return (
          <ProductDetailPage
            product={activeProduct}
            allProducts={PRODUCTS}
            onAddToCart={handleAddToCart}
            onInstantBuy={handleInstantBuy}
            isWishlisted={wishlist.includes(activeProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            reviews={reviews}
            onAddReview={handleAddReview}
            userOrders={orders}
          />
        );

      case 'categories':
        return (
          <CategoriesPage
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo('shop');
            }}
            onNavigate={navigateTo}
          />
        );

      case 'search':
        return (
          <SearchResultsPage
            initialQuery={searchQuery}
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigateTo}
          />
        );

      case 'cart':
        return (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={navigateTo}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            promoCode={promoCode}
            promoDiscountRate={promoDiscountRate}
            onApplyPromo={handleApplyPromo}
          />
        );

      case 'wishlist':
        return (
          <WishlistPage
            wishlist={wishlist}
            products={PRODUCTS}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onMoveToCart={handleMoveToCart}
            onMoveAllToCart={handleMoveAllToCart}
            onOpenProductDetail={handleSelectProduct}
            onNavigate={navigateTo}
          />
        );

      case 'checkout':
        return (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigate={navigateTo}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            promoCode={promoCode}
            promoDiscountRate={promoDiscountRate}
            onApplyPromo={handleApplyPromo}
          />
        );

      case 'login':
        return (
          <LoginPage
            onLoginSuccess={(signedInUser: User) => {
              setUser(signedInUser);
              addToast({
                title: 'Welcome Back',
                message: `Signed in as ${signedInUser.firstName} ${signedInUser.lastName}.`,
                type: 'success',
                duration: 3000
              });
              navigateTo('profile');
            }}
            onNavigate={navigateTo}
          />
        );

      case 'register':
        return (
          <RegisterPage
            onRegisterSuccess={(newUser: User) => {
              setUser(newUser);
              addToast({
                title: 'Membership Created',
                message: `Welcome to Atelier Society, ${newUser.firstName} ${newUser.lastName}.`,
                type: 'success',
                duration: 4000
              });
              navigateTo('profile');
            }}
            onNavigate={navigateTo}
          />
        );

      case 'profile':
        if (!user) {
          return (
            <LoginPage
              onLoginSuccess={(signedInUser: User) => {
                setUser(signedInUser);
                navigateTo('profile');
              }}
              onNavigate={navigateTo}
            />
          );
        }
        return (
          <ProfilePage
            user={user}
            orders={orders}
            wishlistCount={wishlist.length}
            onLogout={() => {
              setUser(null);
              addToast({
                title: 'Signed Out',
                message: 'You have been securely signed out of your account.',
                type: 'info',
                duration: 3000
              });
              navigateTo('home');
            }}
            onUpdateAddress={(address) => {
              setUser((prev) => prev ? { ...prev, defaultAddress: address } : null);
              addToast({
                title: 'Address Updated',
                message: 'Your shipping address has been updated.',
                type: 'success',
                duration: 3000
              });
            }}
            onNavigate={navigateTo}
          />
        );

      case 'orders':
        return (
          <OrderHistoryPage
            orders={orders}
            onTrackOrder={(order: Order) => {
              setActiveTrackingOrder(order);
              setIsTrackingOpen(true);
            }}
            onNavigate={navigateTo}
          />
        );

      case 'about':
        return <AboutPage onNavigate={navigateTo} />;

      case 'contact':
        return (
          <ContactPage
            onSubmitMessage={(msg) => {
              handleSendMessage({
                id: `msg-${Date.now()}`,
                name: msg.name,
                email: msg.email,
                subject: msg.subject,
                message: msg.message,
                createdAt: new Date().toISOString()
              });
            }}
            onNavigate={navigateTo}
          />
        );

      case 'faq':
        return <FAQPage onNavigate={navigateTo} />;

      case '404':
      default:
        return (
          <NotFoundPage
            onNavigate={navigateTo}
            onSearch={handleSearchSubmit}
            featuredProducts={PRODUCTS}
            onSelectProduct={handleSelectProduct}
          />
        );
    }
  };

  // Main Application Shell
  const appShell = (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-20 lg:pb-0 font-sans selection:bg-stone-900 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Universal Top Bar */}
      <Navbar
        cart={cart}
        orders={orders}
        activeOrder={activeOrder}
        wishlistCount={wishlist.length}
        currentPage={currentPage}
        onNavigate={navigateTo}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => navigateTo('orders')}
        onOpenWishlist={() => navigateTo('wishlist')}
        onOpenTracking={(order) => {
          setActiveTrackingOrder(order);
          setIsTrackingOpen(true);
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo('shop');
        }}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
      />

      {/* Dynamic Page Body */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Universal Luxury Footer */}
      <Footer
        onNavigate={navigateTo}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo('shop');
        }}
        onSubscribeNewsletter={(email) => {
          addToast({
            title: 'Subscribed to Dispatch',
            message: `Private seasonal collections will be delivered to ${email}.`,
            type: 'success',
            duration: 4000
          });
        }}
      />

      {/* Mobile Bottom Fixed Navigation */}
      <MobileBottomNav
        cart={cart}
        orders={orders}
        activeOrder={activeOrder}
        wishlistCount={wishlist.length}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        reviews={reviews}
        onAddReview={handleAddReview}
        userOrders={orders}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistProductIds={wishlist}
        allProducts={PRODUCTS}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onMoveAllToCart={handleMoveAllToCart}
        onOpenProductDetail={handleSelectProduct}
      />

      {/* Shopping Bag Slideout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        promoDiscountRate={promoDiscountRate}
        onApplyPromo={handleApplyPromo}
      />

      {/* PCI-DSS Level 1 Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        promoDiscountRate={promoDiscountRate}
        promoCode={promoCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Real-time GPS Order Tracking Modal */}
      <OrderTrackingModal
        order={activeTrackingOrder}
        onClose={() => setIsTrackingOpen(false)}
        onUpdateOrder={handleUpdateOrder}
      />

      {/* Quick Order History Drawer */}
      <OrderHistoryDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onSelectOrder={(order) => {
          setActiveTrackingOrder(order);
          setIsTrackingOpen(true);
        }}
      />
    </div>
  );

  // If Mobile Preview simulator is active on Desktop
  if (isMobilePreview) {
    return (
      <div className="min-h-screen bg-stone-900 py-6 px-4 flex flex-col items-center justify-center">
        {/* Device frame header */}
        <div className="w-full max-w-[420px] mb-3 flex items-center justify-between text-white text-xs px-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Mobile Device Simulator (iPhone 16 Pro)</span>
          </div>
          <button
            onClick={() => setIsMobilePreview(false)}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Exit to Desktop
          </button>
        </div>

        {/* Device Frame */}
        <div className="w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 relative overflow-hidden flex flex-col">
          {/* Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-stone-900/80 mr-3" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-stone-50 rounded-[38px] overflow-y-auto overflow-x-hidden relative">
            {appShell}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-600 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  return appShell;
}
