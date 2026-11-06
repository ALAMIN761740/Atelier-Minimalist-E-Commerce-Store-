import React, { useState } from 'react';
import { 
  Package, Truck, ChevronRight, Clock, CheckCircle2, 
  Search, ArrowRight, ArrowLeft, Printer, Copy, Check 
} from 'lucide-react';
import { Order, PageRoute } from '../types/ecommerce';

interface OrderHistoryPageProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onNavigate: (page: PageRoute) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  orders,
  onTrackOrder,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'delivered'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'delivered') return o.orderStatus === 'delivered';
    if (filter === 'in_transit') return o.orderStatus !== 'delivered';
    return true;
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            Client Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            Order History & Shipments
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track real-time courier dispatch and review official merchant receipts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'in_transit', label: 'In Transit' },
          { id: 'delivered', label: 'Delivered' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Package className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">No Orders Found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            When you place an order, live GPS telemetry, estimated delivery milestones, and receipts will appear here.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isDelivered = order.orderStatus === 'delivered';
            const isOut = order.orderStatus === 'out_for_delivery';

            return (
              <div
                key={order.orderId}
                onClick={() => onTrackOrder(order)}
                className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-stone-400 transition-all cursor-pointer shadow-xs space-y-4"
              >
                {/* Top Row: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      Order #{order.orderId}
                    </span>
                    <button
                      onClick={(e) => handleCopyId(order.orderId, e)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                      title="Copy Order ID"
                    >
                      {copiedId === order.orderId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      isDelivered
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOut
                        ? 'bg-sky-100 text-sky-800 font-bold'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      ● {order.orderStatus.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-stone-900 tabular-nums">
                      ${order.total}
                    </span>
                  </div>
                </div>

                {/* Items Row */}
                <div className="flex flex-wrap items-center gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-stone-50 p-2 rounded-xl border border-stone-200/80">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="text-xs pr-2">
                        <p className="font-semibold text-stone-900 max-w-[160px] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-stone-400">Qty: {item.quantity} · {item.selectedSize}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Receipt Trigger */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-stone-700" />
                    <span>Carrier: <strong className="text-stone-900">{order.tracking.carrier}</strong></span>
                    <span>·</span>
                    <span className="font-mono text-stone-500">Track: {order.tracking.trackingNumber}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-stone-900 font-semibold group-hover:underline">
                    <span>Open Live Telemetry & Receipt</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
