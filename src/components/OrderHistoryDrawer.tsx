import React from 'react';
import { X, Truck, Package, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { Order } from '../types/ecommerce';

interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrderHistoryDrawer: React.FC<OrderHistoryDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over panel */}
      <aside 
        role="dialog"
        aria-modal="true"
        aria-label="Order History"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Order History
            </h2>
            <span className="text-xs text-stone-500 font-medium tabular-nums">
              ({orders.length} orders)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <Package className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="text-base font-semibold text-stone-700">No Orders Yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                When you place an order, live tracking and receipts will appear here in real time.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isDelivered = order.orderStatus === 'delivered';
              const isOut = order.orderStatus === 'out_for_delivery';

              return (
                <div
                  key={order.orderId}
                  onClick={() => {
                    onSelectOrder(order);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          #{order.orderId}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOut
                            ? 'bg-sky-100 text-sky-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 mt-0.5 block">
                        {new Date(order.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <span className="text-sm font-bold text-stone-900 tabular-nums">
                      ${order.total}
                    </span>
                  </div>

                  {/* Thumbnail previews */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                      />
                    ))}
                    <div className="text-xs text-stone-500 pl-1">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                  </div>

                  {/* Action trigger */}
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-700 font-semibold">
                    <span className="flex items-center gap-1.5 text-stone-900">
                      <Truck className="w-3.5 h-3.5 text-stone-700" />
                      <span>Track Live Shipment</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </aside>
    </div>
  );
};
