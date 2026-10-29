import React, { useState, useEffect } from 'react';
import { Package, Search, Clock, CheckCircle2, Truck, ChefHat, MapPin, ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Order } from '../types';

interface OrderTrackingProps {
  user: any;
  initialOrderId?: string;
  setCurrentView: (view: string, id?: string) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ user, initialOrderId, setCurrentView }) => {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchUserOrders();
    if (initialOrderId) {
      fetchSingleOrder(initialOrderId);
    }
  }, [user, initialOrderId]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem('smash_user_orders') || '[]');
      const remoteOrders: Order[] = [];
      if (user?.uid) {
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((d) => {
            remoteOrders.push({ id: d.id, ...d.data() } as Order);
          });
        } catch (e) {
          console.warn('Firestore query orders error:', e);
        }
      }
      const orderMap = new Map<string, Order>();
      localOrders.forEach((o) => orderMap.set(o.id, o));
      remoteOrders.forEach((o) => orderMap.set(o.id, o));
      const combined = Array.from(orderMap.values());
      setOrders(combined);
      if (combined.length > 0 && !initialOrderId) {
        setSelectedOrder(combined[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem('smash_user_orders') || '[]');
      const foundInLocal = localOrders.find((o) => o.id === id);
      if (foundInLocal) {
        setSelectedOrder(foundInLocal);
        return;
      }
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
        setSelectedOrder(orderData);
        if (!orders.some((o) => o.id === orderData.id)) {
          setOrders((prev) => [orderData, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchSingleOrder(searchId.trim());
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-500">Live Telemetry</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] mt-1">Live Order Status</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">Track your smash burger from flat-top grill to your doorstep.</p>
        </div>

        {/* Search by Order ID */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-56 sm:w-64 pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: User recent orders (4 cols) */}
        <div className="lg:col-span-4 bg-stone-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit']">Your Order History</h3>
          {loading && <p className="text-xs text-stone-400">Loading orders...</p>}
          {!user && (
            <p className="text-xs text-stone-400">
              You are browsing as guest. Enter your Order ID above or sign in to save your history.
            </p>
          )}
          {orders.length === 0 && !loading && (
            <p className="text-xs text-stone-500">No orders recorded under this session yet.</p>
          )}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedOrder?.id === o.id
                    ? 'bg-orange-500/15 border-orange-500 shadow-lg shadow-orange-500/10'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-amber-300">ID: {o.id.slice(0, 8)}...</span>
                  <span className="text-xs font-black text-white font-['Outfit']">${o.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-400">
                  <span>{o.items.length} items</span>
                  <span className="font-bold text-orange-400">{o.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Selected Order Live Telemetry (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/15 shadow-2xl space-y-8 glass-card-reflection">
          {selectedOrder ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Active Order ID</span>
                  <h3 className="font-mono text-lg font-black text-amber-300">{selectedOrder.id}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Phase</span>
                  <p className="text-base font-black text-orange-400 font-['Outfit']">{selectedOrder.orderStatus}</p>
                </div>
              </div>

              {/* Progress 5-step Stepper */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                  const currentIdx = getStatusStep(selectedOrder.orderStatus);
                  const isCompleted = idx <= currentIdx;
                  return (
                    <div key={step} className="text-center space-y-2">
                      <div
                        className={`w-11 h-11 mx-auto rounded-2xl flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-orange-600/30 scale-105'
                            : 'bg-white/5 text-stone-500 border border-white/10'
                        }`}
                      >
                        {idx === 0 && <Clock className="w-4 h-4" />}
                        {idx === 1 && <CheckCircle2 className="w-4 h-4" />}
                        {idx === 2 && <ChefHat className="w-4 h-4" />}
                        {idx === 3 && <Truck className="w-4 h-4" />}
                        {idx === 4 && <Package className="w-4 h-4" />}
                      </div>
                      <span className={`text-[10px] font-bold block ${isCompleted ? 'text-orange-400' : 'text-stone-500'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Details & Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.03] p-6 rounded-2xl border border-white/10 text-xs">
                <div className="space-y-1">
                  <p className="font-bold uppercase text-stone-400">Delivery Address</p>
                  <p className="font-semibold text-white">
                    {selectedOrder.address.house}, {selectedOrder.address.street}
                  </p>
                  <p className="text-stone-400">
                    {selectedOrder.address.area}, {selectedOrder.address.city} {selectedOrder.address.postalCode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold uppercase text-stone-400">Customer Info</p>
                  <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                  <p className="text-stone-400">{selectedOrder.phone} | {selectedOrder.email}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-stone-400">Ordered Food Items</h4>
                <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        <div>
                          <p className="font-bold text-white">{item.name}</p>
                          <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-300">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <Package className="w-14 h-14 text-stone-600 mx-auto" />
              <h4 className="font-bold text-white text-base">Select an order or enter an ID above</h4>
              <p className="text-xs text-stone-400">Live order status steps and delivery estimates will show here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
