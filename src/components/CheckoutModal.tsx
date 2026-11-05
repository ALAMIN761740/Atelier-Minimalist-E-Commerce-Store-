import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, CreditCard, CheckCircle2, ChevronRight, 
  Smartphone, AlertCircle, Sparkles, Building, MapPin, Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, ShippingAddress, ShippingMethod, PaymentMethod, Order, CardDetails } from '../types/ecommerce';
import { SHIPPING_METHODS, DEMO_ADDRESS } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  promoDiscountRate: number;
  promoCode: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  promoDiscountRate,
  promoCode,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  // Step state: 1 = Shipping, 2 = Payment & Review
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  const [card, setCard] = useState<CardDetails>({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
    brand: 'generic'
  });

  const [saveCard, setSaveCard] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [otpCode, setOtpCode] = useState('8492');
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * promoDiscountRate);
  const effectiveShippingPrice = subtotal >= 150 && selectedShipping.id === 'ship-standard' ? 0 : selectedShipping.price;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.0825);
  const total = subtotal - discountAmount + effectiveShippingPrice + estimatedTax;

  // Autofill Demo Profile for rapid testing
  const handleAutofillDemo = () => {
    setAddress(DEMO_ADDRESS);
    setCard({
      cardNumber: '4532 8920 1289 4429',
      cardholderName: 'Elena Rostova',
      expiry: '09/28',
      cvv: '849',
      brand: 'visa'
    });
    setFormErrors({});
  };

  // Card formatting helpers
  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    let brand: 'visa' | 'mastercard' | 'amex' | 'generic' = 'generic';
    if (raw.startsWith('4')) brand = 'visa';
    else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(raw)) brand = 'mastercard';
    else if (/^3[47]/.test(raw)) brand = 'amex';

    setCard(prev => ({ ...prev, cardNumber: formatted, brand }));
  };

  const handleExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    let formatted = raw;
    if (raw.length >= 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCard(prev => ({ ...prev, expiry: formatted }));
  };

  const handleCvvChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    setCard(prev => ({ ...prev, cvv: raw }));
  };

  // Validate step 1
  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    if (!address.fullName.trim()) errors.fullName = 'Full name is required';
    if (!address.email.trim() || !address.email.includes('@')) errors.email = 'Valid email is required';
    if (!address.phone.trim()) errors.phone = 'Phone number is required';
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.postalCode.trim()) errors.postalCode = 'Postal / ZIP code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to Step 2
  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Create final order object
  const createOrderObject = (paymentState: 'paid' | 'authorized' | 'cash_on_delivery'): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `AUR-${randomSuffix}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      orderId,
      createdAt: now.toISOString(),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shippingFee: effectiveShippingPrice,
      tax: estimatedTax,
      total,
      shippingAddress: { ...address },
      shippingMethod: { ...selectedShipping, price: effectiveShippingPrice },
      paymentMethod,
      paymentStatus: paymentState,
      orderStatus: 'confirmed',
      currentStepIndex: 0,
      tracking: {
        carrier: selectedShipping.carrier,
        trackingNumber: `ATL-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: selectedShipping.estimate,
        driverProgressPercent: 5,
        driver: {
          name: 'Marcus Donovan',
          phone: '+1 (415) 555-0199',
          vehicle: 'Toyota Prius (Hybrid)',
          plate: '7TRF92',
          rating: 4.96,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          minutesAway: 24
        },
        timeline: [
          {
            status: 'confirmed',
            title: 'Order Confirmed & Payment Verified',
            description: `Payment of $${total} authorized via ${paymentMethod === 'card' ? 'Secure Card Gateway' : paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Cash on Delivery'}. Receipt generated.`,
            timestamp: timeString,
            completed: true,
            active: true
          },
          {
            status: 'processing',
            title: 'Quality Check & Atelier Packaging',
            description: 'Garments and objects inspected and placed in FSC-certified protective dust bags.',
            timestamp: 'Pending',
            completed: false
          },
          {
            status: 'shipped',
            title: 'Handed to Logistics Carrier',
            description: `Manifest dispatched to ${selectedShipping.carrier} fulfillment hub.`,
            timestamp: 'Pending',
            completed: false
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Delivery (Courier Dispatched)',
            description: 'Courier driver en route to your delivery address with live telemetry.',
            timestamp: 'Pending',
            completed: false
          },
          {
            status: 'delivered',
            title: 'Delivered to Doorstep',
            description: 'Package delivered with signature verification.',
            timestamp: 'Pending',
            completed: false
          }
        ]
      }
    };
  };

  // Complete Payment Gateway flow
  const handleFinalPayment = () => {
    // If card payment and not filled, autofill or validate
    if (paymentMethod === 'card') {
      if (card.cardNumber.length < 15 || !card.expiry || !card.cvv) {
        setFormErrors({ card: 'Please enter valid credit card details (or tap Demo Profile).' });
        return;
      }

      // Simulate 3D Secure bank challenge for card transactions
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShow3DSModal(true);
      }, 700);
      return;
    }

    // Express Apple Pay / Google Pay / COD
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerSuccessCelebration();
    }, 1200);
  };

  const handleVerify3DSecure = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() !== otpCode && inputOtp.trim() !== '1234') {
      setOtpError(true);
      return;
    }

    setShow3DSModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerSuccessCelebration();
    }, 900);
  };

  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    const newOrder = createOrderObject(paymentMethod === 'cod' ? 'cash_on_delivery' : 'paid');
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative bg-white w-full max-w-2xl max-h-[94vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
      >
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="checkout-title" className="text-base sm:text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                <span>Secure Mobile Checkout</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  PCI-DSS SECURE
                </span>
              </h2>
              <p className="text-xs text-stone-500">256-Bit TLS End-to-End Encryption</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar & 1-Tap Demo Button */}
        <div className="px-4 py-2.5 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <button
              onClick={() => setCurrentStep(1)}
              className={`cursor-pointer flex items-center gap-1.5 ${
                currentStep === 1 ? 'text-stone-900 font-bold' : 'text-stone-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center">1</span>
              <span>Delivery</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <button
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`cursor-pointer flex items-center gap-1.5 ${
                currentStep === 2 ? 'text-stone-900 font-bold' : 'text-stone-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${
                currentStep === 2 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
              }`}>2</span>
              <span>Payment & Gateway</span>
            </button>
          </div>

          {/* 1-Tap Quick Demo Profile */}
          <button
            onClick={handleAutofillDemo}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-full cursor-pointer transition-colors text-[11px]"
            title="Pre-populate with sample address and card details"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>1-Tap Demo Profile</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-grow space-y-6">
          
          {/* STEP 1: DELIVERY & CONTACT */}
          {currentStep === 1 && (
            <div className="space-y-5">
              
              {/* Express 1-Tap Pay Options for Mobile */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Express 1-Tap Mobile Checkout
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleAutofillDemo();
                      setPaymentMethod('apple_pay');
                      setCurrentStep(2);
                    }}
                    className="h-11 rounded-lg bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-stone-900 transition-colors cursor-pointer"
                  >
                    <span> Apple Pay</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAutofillDemo();
                      setPaymentMethod('google_pay');
                      setCurrentStep(2);
                    }}
                    className="h-11 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-blue-600">G</span>
                    <span>Pay</span>
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Customer Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                        formErrors.fullName ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.fullName && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      placeholder="elena@example.com"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                        formErrors.email ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Mobile Phone (for delivery SMS updates)</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+1 (415) 890-4211"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                        formErrors.phone ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Shipping Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="450 Townsend St"
                      className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                        formErrors.street ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.street && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.street}</p>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Apt / Suite</label>
                      <input
                        type="text"
                        value={address.apartment}
                        onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                        placeholder="Suite 3B"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="San Francisco"
                        className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                          formErrors.city ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                        }`}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        placeholder="94107"
                        className={`w-full px-3 py-2 text-xs rounded-lg border bg-white outline-none ${
                          formErrors.postalCode ? 'border-rose-500' : 'border-stone-200 focus:border-stone-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Delivery Methods */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Delivery Method
                </h3>
                <div className="space-y-2">
                  {SHIPPING_METHODS.map((method) => {
                    const isFree = subtotal >= 150 && method.id === 'ship-standard';
                    const isSelected = selectedShipping.id === method.id;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShipping(method)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedShipping(method)}
                            className="w-4 h-4 text-stone-900"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-stone-900">{method.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">({method.carrier})</span>
                            </div>
                            <span className="text-[11px] text-stone-500">{method.estimate}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          {isFree ? 'FREE' : `$${method.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: PAYMENT GATEWAY INTEGRATION & CONFIRMATION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              
              {/* Order quick summary bar */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-stone-500">Deliver to: </span>
                  <span className="font-semibold text-stone-900">{address.fullName} ({address.city}, {address.postalCode})</span>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-stone-700 underline text-[11px] font-medium cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Payment Gateway
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">Credit Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">Apple / G-Pay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">Pay on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Card Gateway Fields */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-stone-800">Card Payment Gateway</span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded ${card.brand === 'visa' ? 'bg-blue-600 text-white' : 'bg-stone-200 text-stone-600'}`}>VISA</span>
                      <span className={`px-1.5 py-0.5 rounded ${card.brand === 'mastercard' ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-600'}`}>MC</span>
                      <span className={`px-1.5 py-0.5 rounded ${card.brand === 'amex' ? 'bg-teal-700 text-white' : 'bg-stone-200 text-stone-600'}`}>AMEX</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={card.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4532 8920 1289 4429"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-300 bg-white outline-none focus:border-stone-900 tracking-wider"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={card.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-300 bg-white outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1 flex items-center justify-between">
                        <span>Security Code (CVV)</span>
                        <span className="text-[10px] text-stone-400" title="3 or 4 digits on back of card">?</span>
                      </label>
                      <input
                        type="password"
                        value={card.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-300 bg-white outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={card.cardholderName || address.fullName}
                      onChange={(e) => setCard({ ...card, cardholderName: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white outline-none focus:border-stone-900"
                    />
                  </div>

                  <label className="flex items-center gap-2 pt-1 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded text-stone-900"
                    />
                    <span>Save card securely via tokenization for future 1-click orders</span>
                  </label>

                  {formErrors.card && (
                    <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formErrors.card}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Apple / Google Pay Screen */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">Apple Pay Express Active</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Biometric authorization via Face ID or Touch ID will complete your transaction instantly without entering card numbers.
                  </p>
                </div>
              )}

              {/* COD Notice */}
              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
                  <span className="font-semibold block">Cash on Delivery (Verified)</span>
                  <p className="text-amber-800 text-[11px]">
                    Pay in cash or credit card upon courier arrival at your doorstep. We will send an SMS dispatch code to <strong className="font-mono">{address.phone}</strong> for security verification.
                  </p>
                </div>
              )}

              {/* Itemized Order Breakdown */}
              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="font-semibold text-stone-900 tabular-nums">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Applied ({promoCode || 'SAVE15'})</span>
                    <span className="tabular-nums">-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({selectedShipping.name})</span>
                  <span className="tabular-nums">
                    {effectiveShippingPrice === 0 ? 'FREE' : `$${effectiveShippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="tabular-nums">${estimatedTax}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-base pt-2 border-t border-stone-200">
                  <span>Total Amount Due</span>
                  <span className="tabular-nums">${total}</span>
                </div>
              </div>

              {/* Back to Step 1 or Finalize Button */}
              <div className="space-y-2">
                <button
                  onClick={handleFinalPayment}
                  disabled={isProcessing}
                  className="w-full h-13 min-h-[48px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-lg shadow-stone-900/10"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Contacting Payment Gateway...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${total} & Authorize Order</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full text-xs text-stone-500 hover:text-stone-800 py-1 transition-colors cursor-pointer"
                >
                  ← Back to Delivery Details
                </button>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Bank-Grade Encryption
                </span>
                <span>·</span>
                <span>Zero Liability Protection</span>
                <span>·</span>
                <span>30-Day Guarantee</span>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3D SECURE VERIFICATION MODAL SIMULATION */}
      {show3DSModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto">
              <Building className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-stone-900 font-display">
              Verified by Visa / Mastercard ID Check
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              To verify this purchase of <strong className="text-stone-900">${total}</strong>, we sent a secure authentication code to your registered mobile phone ending in <strong className="font-mono">**11</strong>.
            </p>

            <div className="p-2.5 bg-stone-100 rounded-lg text-xs font-mono text-stone-700">
              Test Security Code: <span className="font-bold tracking-widest text-stone-900">{otpCode}</span>
            </div>

            <form onSubmit={handleVerify3DSecure} className="space-y-3">
              <input
                type="text"
                value={inputOtp}
                onChange={(e) => {
                  setInputOtp(e.target.value);
                  setOtpError(false);
                }}
                placeholder="Enter 4-digit code"
                autoFocus
                maxLength={4}
                className="w-full text-center text-lg font-mono tracking-widest px-3 py-2 border rounded-lg outline-none focus:border-stone-900"
              />

              {otpError && (
                <p className="text-[11px] text-rose-600">Incorrect code. Please enter {otpCode}.</p>
              )}

              <button
                type="submit"
                className="w-full h-11 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Verify & Complete Purchase
              </button>
            </form>

            <button
              onClick={() => setShow3DSModal(false)}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
