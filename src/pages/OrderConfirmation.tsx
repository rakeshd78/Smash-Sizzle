import React from 'react';
import { CheckCircle2, Clock, Package, ArrowRight, Home } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string;
  setCurrentView: (view: string, id?: string) => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, setCurrentView }) => {
  return (
    <div className="max-w-[1720px] mx-auto px-4 py-24 text-center space-y-8 text-white">
      <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-emerald-500/40">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <div className="space-y-3">
        <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest rounded-full border border-emerald-500/30">
          Order Successfully Dispatched to Kitchen
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">Thank You For Your Order!</h1>
        <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
          The patties are hitting the hot flat-top right now. Your order has been registered in our kitchen queue.
        </p>
      </div>

      <div className="bg-stone-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md mx-auto space-y-4 text-left glass-card-reflection">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Order ID</span>
          <span className="font-mono font-black text-amber-300 bg-white/5 px-3 py-1 rounded-lg text-xs">
            {orderId || 'SNS-98421'}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Estimated Delivery</span>
          <span className="font-bold text-orange-400 flex items-center gap-1.5 text-xs">
            <Clock className="w-4 h-4" /> 25–35 Mins
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Status</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs">
            Confirmed & Sizzling
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button
          onClick={() => setCurrentView('tracking', orderId)}
          className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Track Live Order Status</span>
        </button>
        <button
          onClick={() => setCurrentView('home')}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};
