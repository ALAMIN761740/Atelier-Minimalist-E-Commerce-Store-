import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, Truck, Package, Clock, Phone, MessageSquare, 
  MapPin, ShieldCheck, Copy, Check, ChevronRight, Play, RotateCcw,
  Sparkles, ExternalLink, Printer
} from 'lucide-react';
import { Order, OrderTimelineStep } from '../types/ecommerce';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onUpdateOrder
}) => {
  if (!order) return null;

  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracking' | 'receipt'>('tracking');
  const [driverMessageModal, setDriverMessageModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Hi Elena! I have your Atelier order safely onboard. On schedule for delivery!"
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [callModal, setCallModal] = useState(false);

  // Live Auto-Simulation Interval
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      // If order is out for delivery or processing, simulate slight progress
      if (order.orderStatus === 'confirmed') {
        advanceToStep(1);
      } else if (order.orderStatus === 'processing') {
        advanceToStep(2);
      } else if (order.orderStatus === 'shipped') {
        advanceToStep(3);
      } else if (order.orderStatus === 'out_for_delivery') {
        // Increment progress percent
        const currentProgress = order.tracking.driverProgressPercent || 35;
        if (currentProgress < 95) {
          const updated = {
            ...order,
            tracking: {
              ...order.tracking,
              driverProgressPercent: Math.min(95, currentProgress + 15),
              driver: order.tracking.driver ? {
                ...order.tracking.driver,
                minutesAway: Math.max(2, order.tracking.driver.minutesAway - 3)
              } : undefined
            }
          };
          onUpdateOrder(updated);
        } else {
          advanceToStep(4); // Delivered
          setIsSimulatingLive(false);
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isSimulatingLive, order]);

  // Copy tracking number helper
  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(order.tracking.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Step advancement logic
  const advanceToStep = (targetStep: number) => {
    const steps: ('confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered')[] = [
      'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'
    ];
    const newStatus = steps[targetStep];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTimeline = order.tracking.timeline.map((item, index) => {
      if (index < targetStep) {
        return { ...item, completed: true, active: false };
      } else if (index === targetStep) {
        return { ...item, completed: true, active: true, timestamp: timeStr };
      } else {
        return { ...item, completed: false, active: false };
      }
    });

    const driverProgress = targetStep === 0 ? 5 : targetStep === 1 ? 25 : targetStep === 2 ? 50 : targetStep === 3 ? 80 : 100;

    const updatedOrder: Order = {
      ...order,
      orderStatus: newStatus,
      currentStepIndex: targetStep,
      tracking: {
        ...order.tracking,
        timeline: newTimeline,
        driverProgressPercent: driverProgress,
        driver: order.tracking.driver ? {
          ...order.tracking.driver,
          minutesAway: targetStep === 4 ? 0 : targetStep === 3 ? 8 : 22
        } : undefined
      }
    };

    onUpdateOrder(updatedOrder);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [...prev, inputMsg.trim()]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, "Got it! Thanks for the note, arriving shortly."]);
    }, 1200);
  };

  const currentStep = order.currentStepIndex ?? (
    order.orderStatus === 'confirmed' ? 0 :
    order.orderStatus === 'processing' ? 1 :
    order.orderStatus === 'shipped' ? 2 :
    order.orderStatus === 'out_for_delivery' ? 3 : 4
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-title"
        className="relative bg-white w-full max-w-3xl max-h-[94vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                ● LIVE DISPATCH
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs font-mono font-semibold text-stone-700">
                Order #{order.orderId}
              </span>
            </div>
            <h2 id="tracking-title" className="text-base sm:text-xl font-bold text-stone-900 font-display mt-0.5">
              Real-Time Order Telemetry & Delivery
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav Tabs & Simulation Controls */}
        <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'tracking' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Live Journey & Map
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'receipt' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Order Receipt ({order.items.length} items)
            </button>
          </div>

          {/* Interactive Simulation Action Controls */}
          <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-lg">
            <button
              onClick={() => advanceToStep(Math.min(4, currentStep + 1))}
              disabled={currentStep >= 4}
              className="px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-800 rounded font-medium text-[11px] shadow-xs cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1"
              title="Advance to next shipment stage"
            >
              <Play className="w-3 h-3 text-stone-700" />
              <span>Advance Stage</span>
            </button>
            <button
              onClick={() => advanceToStep(0)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-50 text-stone-600 rounded text-[11px] cursor-pointer"
              title="Reset simulation to Order Confirmed"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-grow space-y-6">
          
          {activeTab === 'tracking' && (
            <>
              {/* INTERACTIVE DELIVERY ROUTE VECTOR MAP */}
              <div className="relative w-full h-52 sm:h-64 bg-stone-950 rounded-xl overflow-hidden border border-stone-800 shadow-inner">
                {/* Stylized Modern Dark Vector Map Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2,2" />
                    </pattern>
                    <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  
                  <rect width="100%" height="100%" fill="#1c1917" />
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                  {/* Stylized City Roads */}
                  <path d="M 0 120 Q 200 80 400 130 T 800 110" fill="none" stroke="#292524" strokeWidth="18" />
                  <path d="M 0 120 Q 200 80 400 130 T 800 110" fill="none" stroke="#44403c" strokeWidth="2" strokeDasharray="6,4" />

                  <path d="M 160 0 L 160 300" fill="none" stroke="#292524" strokeWidth="12" />
                  <path d="M 480 0 L 480 300" fill="none" stroke="#292524" strokeWidth="12" />

                  {/* Active Delivery Path Curve */}
                  <path
                    id="deliveryRoute"
                    d="M 60 160 C 140 160, 200 70, 320 80 S 520 180, 680 120"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                </svg>

                {/* Warehouse Origin Pin */}
                <div className="absolute left-6 top-32 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-500 text-stone-200 flex items-center justify-center text-xs shadow-lg">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 mt-1 bg-stone-900/80 px-1.5 py-0.5 rounded">
                    Atelier Hub
                  </span>
                </div>

                {/* Destination Customer Pin */}
                <div className="absolute right-6 top-20 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-300 mt-1 bg-stone-900/90 px-2 py-0.5 rounded border border-emerald-800">
                    {order.shippingAddress.city || 'Destination'}
                  </span>
                </div>

                {/* Animated Moving Courier Vehicle along Progress */}
                <div 
                  className="absolute transition-all duration-1000 ease-in-out flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.max(12, Math.min(88, order.tracking.driverProgressPercent))}%`,
                    top: `${48 + Math.sin(order.tracking.driverProgressPercent / 12) * 18}%`
                  }}
                >
                  <div className="relative">
                    {/* Pulsing signal halo */}
                    <div className="absolute -inset-2 bg-emerald-400/30 rounded-full animate-ping" />
                    <div className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-2xl border-2 border-emerald-500 z-10">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-1 bg-stone-900/95 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-stone-700 shadow-md whitespace-nowrap">
                    {currentStep === 4 ? 'Arrived!' : `${order.tracking.driver?.minutesAway || 14} min ETA`}
                  </div>
                </div>

                {/* Top overlay banner on map */}
                <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Status: <strong className="text-white capitalize">{order.orderStatus.replace('_', ' ')}</strong>
                  </span>
                </div>

                {/* Carrier details badge */}
                <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-300 flex items-center gap-2 font-mono">
                  <span>{order.tracking.carrier}</span>
                  <span>·</span>
                  <button
                    onClick={handleCopyTracking}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{order.tracking.trackingNumber}</span>
                    {copiedTracking ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* COURIER DRIVER CONTACT CARD (Active during Out for Delivery & Shipped) */}
              {order.tracking.driver && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden shrink-0 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-sm">
                      MD
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{order.tracking.driver.name}</h4>
                        <span className="text-[11px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                          ★ {order.tracking.driver.rating}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        {order.tracking.driver.vehicle} · Plate: <span className="font-mono text-stone-700">{order.tracking.driver.plate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCallModal(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </button>
                    <button
                      onClick={() => setDriverMessageModal(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TIMELINE STEPPER (5-Stage Visual Tracker) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Shipment Progression & Milestones
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {order.tracking.timeline.map((step, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.status} className="relative group">
                        {/* Step Marker Node */}
                        <div 
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-stone-900 text-white ring-4 ring-stone-200'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border-2 border-stone-300 text-stone-300'
                          }`}
                        >
                          {isPassed ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Text Details */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className={`text-xs sm:text-sm font-semibold ${
                              isCurrent ? 'text-stone-900 font-bold' : isPassed ? 'text-stone-800' : 'text-stone-400'
                            }`}>
                              {step.title}
                            </h4>
                            <span className="text-[11px] font-mono text-stone-500">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Destination Address Confirmation */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block mb-0.5">Shipping Destination:</span>
                  <p>
                    {order.shippingAddress.fullName} · {order.shippingAddress.street}
                    {order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-stone-400 text-[11px] mt-1">Delivery Contact: {order.shippingAddress.phone}</p>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ITEMIZED RECEIPT */}
          {activeTab === 'receipt' && (
            <div className="space-y-6">
              <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 font-display">ATELIER STORE</h3>
                    <p className="text-xs text-stone-500">Official Merchant Receipt</p>
                  </div>
                  <div className="text-right text-xs font-mono text-stone-600">
                    <p className="font-bold text-stone-900">#{order.orderId}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="divide-y divide-stone-200 text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-md border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{item.product.name}</p>
                          <p className="text-stone-500 text-[11px]">
                            Qty: {item.quantity} · {item.selectedColor} · {item.selectedSize}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900 tabular-nums">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Math */}
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-stone-900">${order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span className="tabular-nums">-${order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="tabular-nums font-medium text-stone-900">
                      {order.shippingFee === 0 ? 'Complimentary' : `$${order.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax</span>
                    <span className="tabular-nums font-medium text-stone-900">${order.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Paid</span>
                    <span className="tabular-nums">${order.total}</span>
                  </div>
                </div>

                {/* Payment Auth info */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-[11px] text-stone-500 flex justify-between items-center">
                  <span>Payment: <strong className="text-stone-800 uppercase">{order.paymentMethod.replace('_', ' ')}</strong></span>
                  <span className="text-emerald-700 font-semibold font-mono">STATUS: {order.paymentStatus.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* QUICK DRIVER MESSAGE MODAL */}
      {driverMessageModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                  MD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Marcus (Courier)</h4>
                  <span className="text-[10px] text-emerald-600 font-medium">● Online</span>
                </div>
              </div>
              <button
                onClick={() => setDriverMessageModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    i % 2 === 0
                      ? 'bg-stone-100 text-stone-800 self-start'
                      : 'bg-stone-900 text-white ml-auto'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="pt-2 border-t border-stone-200 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Message courier..."
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUICK CALL SIMULATION MODAL */}
      {callModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white max-w-xs w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto text-white">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold">Calling Marcus Donovan</h4>
              <p className="text-xs text-stone-400 mt-1">Courier Hotline (+1 415 555-0199)</p>
              <p className="text-xs text-emerald-400 mt-2 font-mono">Connected · 00:08</p>
            </div>
            <button
              onClick={() => setCallModal(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
