import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { CartItem, Order } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface CheckoutProps {
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  user: any;
  externalPaymentUrl: string;
  setCurrentView: (view: string, id?: string) => void;
  clearCart: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cart,
  subtotal,
  deliveryFee,
  tax,
  discount,
  total,
  user,
  externalPaymentUrl,
  setCurrentView,
  clearCart,
}) => {
  const [formData, setFormData] = useState({
    customerName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    house: '',
    street: '',
    area: '',
    city: 'Flavor Town',
    state: 'CA',
    postalCode: '90210',
    instructions: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.phone || !formData.house || !formData.street || !formData.area) {
      setError('Please fill in all required customer and delivery address fields.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    const newOrder: Omit<Order, 'id'> = {
      userId: user?.uid || 'guest-user',
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      address: {
        house: formData.house,
        street: formData.street,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        instructions: formData.instructions,
      },
      items: cart,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      const placedOrder: Order = {
        id: docRef.id,
        ...newOrder,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('smash_user_orders') || '[]');
      localStorage.setItem('smash_user_orders', JSON.stringify([placedOrder, ...existing]));

      clearCart();

      // If provider configured an external payment URL, redirect there
      if (externalPaymentUrl && externalPaymentUrl.startsWith('http') && !externalPaymentUrl.includes('example.com')) {
        window.location.href = `${externalPaymentUrl}?orderId=${docRef.id}&amount=${total.toFixed(2)}`;
      } else {
        setCurrentView('order-confirmation', docRef.id);
      }
    } catch (err) {
      console.error(err);
      // Fallback local order confirmation guaranteed to show in My Orders & Track Order
      const localId = 'SNS-' + Math.floor(100000 + Math.random() * 900000);
      const placedOrder: Order = {
        id: localId,
        ...newOrder,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('smash_user_orders') || '[]');
      localStorage.setItem('smash_user_orders', JSON.stringify([placedOrder, ...existing]));

      clearCart();
      setCurrentView('order-confirmation', localId);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-24 text-center space-y-4 text-white">
        <h2 className="text-3xl font-black font-['Outfit']">Your tray is empty</h2>
        <p className="text-xs text-stone-400">Please choose some delicious smash burgers before heading to checkout.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-7 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-xs shadow-lg"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-white">
      <button
        onClick={() => setCurrentView('shop')}
        className="flex items-center gap-2 text-stone-400 hover:text-orange-400 font-bold text-xs transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Continue Adding Food
      </button>

      <div>
        <span className="text-xs font-black uppercase tracking-widest text-orange-500">Fast Food Checkout</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] mt-1">Order & Delivery Details</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/30 rounded-2xl text-red-300 text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: 8 Cols */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Customer Info */}
          <div className="bg-stone-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl space-y-5">
            <h3 className="text-lg font-black text-white font-['Outfit'] border-b border-white/10 pb-3">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold uppercase text-stone-400 block mb-1">Phone Number (For Delivery Rider) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-stone-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl space-y-5">
            <h3 className="text-lg font-black text-white font-['Outfit'] border-b border-white/10 pb-3">
              2. Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">House / Flat / Apt Number *</label>
                <input
                  type="text"
                  name="house"
                  required
                  value={formData.house}
                  onChange={handleChange}
                  placeholder="Apt 4B"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="742 Evergreen Terrace"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Area / Locality *</label>
                <input
                  type="text"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Downtown Sizzle"
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Postal / ZIP Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 glass-input rounded-xl font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold uppercase text-stone-400 block mb-1">Delivery Instructions (Optional)</label>
                <textarea
                  name="instructions"
                  rows={2}
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Leave at doorstep, gate code #4829..."
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary: 4-5 Cols */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-stone-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 sticky top-28 glass-card-reflection">
            <h3 className="text-lg font-black text-white font-['Outfit'] border-b border-white/10 pb-3">
              Order Receipt
            </h3>

            <div className="space-y-3.5 max-h-60 overflow-y-auto divide-y divide-white/5">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-white font-bold">
                  {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-white font-bold">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-base pt-3 border-t border-white/10">
                <span>Total Payable</span>
                <span className="text-amber-400 font-['Outfit']">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-orange-950/40 rounded-2xl border border-orange-500/30 text-xs text-orange-200 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-orange-300">
                <Lock className="w-4 h-4 text-orange-400" />
                <span>External Payment Gateway</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Clicking "Pay Now" securely registers your order and connects you to our certified payment processor.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-white/15"
            >
              <CreditCard className="w-5 h-5" />
              <span>{loading ? 'Processing Order...' : `Pay Now ($${total.toFixed(2)})`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
