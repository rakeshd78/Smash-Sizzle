import React, { useState, useEffect } from 'react';
import { User, CreditCard, MapPin, Package, Clock, Plus, Trash2, ShieldCheck, CheckCircle2, ChevronRight, Award, Sparkles } from 'lucide-react';
import { Order, SavedCard, SavedAddress } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface UserDashboardProps {
  user: any;
  setCurrentView: (view: string, id?: string) => void;
  onSignOut: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  setCurrentView,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'cards' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Saved Cards in state & localStorage
  const [cards, setCards] = useState<SavedCard[]>(() => {
    const saved = localStorage.getItem('smash_saved_cards');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'card-1',
            cardHolder: user?.displayName || 'VIP SIZZLE MEMBER',
            cardNumber: '•••• •••• •••• 4242',
            expiry: '12/28',
            cardType: 'visa',
            isDefault: true,
          },
          {
            id: 'card-2',
            cardHolder: user?.displayName || 'VIP SIZZLE MEMBER',
            cardNumber: '•••• •••• •••• 8821',
            expiry: '09/27',
            cardType: 'mastercard',
            isDefault: false,
          },
        ];
  });

  // Saved Addresses in state & localStorage
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('smash_saved_addresses');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'addr-1',
            label: 'Home',
            recipientName: user?.displayName || 'Customer',
            phone: '+1 (555) 234-5678',
            house: 'Apt 4B, Sizzle Towers',
            street: '742 Evergreen Terrace',
            area: 'Downtown Sizzle',
            city: 'Flavor Town',
            state: 'CA',
            postalCode: '90210',
            isDefault: true,
          },
        ];
  });

  // New Card Form Modal
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardHolder: user?.displayName || '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardType: 'visa' as 'visa' | 'mastercard' | 'amex',
  });

  // New Address Form Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    recipientName: user?.displayName || '',
    phone: '',
    house: '',
    street: '',
    area: '',
    city: 'Flavor Town',
    state: 'CA',
    postalCode: '90210',
  });

  useEffect(() => {
    localStorage.setItem('smash_saved_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('smash_saved_addresses', JSON.stringify(addresses));
  }, [addresses]);
  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
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
          console.warn('Firestore query error:', e);
        }
      }
      const orderMap = new Map<string, Order>();
      localOrders.forEach((o) => orderMap.set(o.id, o));
      remoteOrders.forEach((o) => orderMap.set(o.id, o));
      setOrders(Array.from(orderMap.values()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.expiry) return;
    const masked = `•••• •••• •••• ${newCard.cardNumber.slice(-4) || '9999'}`;
    const card: SavedCard = {
      id: 'card-' + Date.now(),
      cardHolder: newCard.cardHolder.toUpperCase() || 'SIZZLE CARDHOLDER',
      cardNumber: masked,
      expiry: newCard.expiry,
      cardType: newCard.cardType,
      isDefault: cards.length === 0,
    };
    setCards([...cards, card]);
    setIsAddCardOpen(false);
    setNewCard({ cardHolder: '', cardNumber: '', expiry: '', cvv: '', cardType: 'visa' });
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addr: SavedAddress = {
      id: 'addr-' + Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, addr]);
    setIsAddAddressOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
      {/* User Header Profile Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950 border border-white/10 shadow-2xl overflow-hidden glass-card-reflection">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-xl border-2 border-orange-500/50">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 p-1 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  {user?.displayName || 'Valued Customer'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Gold Sizzle VIP
                </span>
              </div>
              <p className="text-xs text-stone-400">{user?.email || 'Logged in as Guest User'}</p>
              <p className="text-[11px] text-amber-300 flex items-center gap-1 justify-center sm:justify-start">
                <Award className="w-3.5 h-3.5" /> 450 Sizzle Reward Points Available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('shop')}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/30 transition-all hover:scale-105"
            >
              Order Food Now
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 rounded-xl text-xs font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15 border-b-transparent shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15 border-b-transparent shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Saved Cards & Payment ({cards.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15 border-b-transparent shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15 border-b-transparent shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Details</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-stone-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl">
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white font-['Outfit']">Order History & Live Status</h3>
                <p className="text-xs text-stone-400 mt-0.5">Track past deliveries or watch your ongoing orders in real-time.</p>
              </div>
              <button
                onClick={() => setCurrentView('tracking')}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>Live Tracker View</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loadingOrders && <p className="text-xs text-stone-400">Loading your orders...</p>}

            {orders.length === 0 && !loadingOrders ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">No orders yet</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Satisfy your cravings today with our juicy smash burgers and sizzling sides!
                </p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-stone-300 bg-white/5 px-2.5 py-1 rounded-md">
                          #{o.id.slice(0, 8)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">
                        {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Delivery to: {o.address.house}, {o.address.street}, {o.address.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-stone-400 font-bold block">Total Amount</span>
                        <span className="text-lg font-black text-white font-['Outfit']">${o.total.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setCurrentView('tracking', o.id)}
                        className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 rounded-xl text-xs font-bold transition-all"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED CARDS (GLOSSY CREDIT CARDS SIMULATOR) */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white font-['Outfit']">Saved Payment Methods</h3>
                <p className="text-xs text-stone-400 mt-0.5">Manage your credit and debit cards for instant 1-click checkout.</p>
              </div>
              <button
                onClick={() => setIsAddCardOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Card</span>
              </button>
            </div>

            {/* Glossy Realistic 3D Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="relative h-52 rounded-3xl p-6 text-white overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between group transform hover:-translate-y-1 transition-all duration-300"
                  style={{
                    background:
                      c.cardType === 'visa'
                        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)'
                        : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #b91c1c 100%)',
                  }}
                >
                  {/* Gloss overlay reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Top Row: Chip & Card Type */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-12 h-9 bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg border border-amber-200/50 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-5 border border-stone-800/40 rounded-xs grid grid-cols-2" />
                    </div>
                    <span className="font-extrabold text-lg uppercase tracking-widest font-['Outfit'] opacity-90">
                      {c.cardType.toUpperCase()}
                    </span>
                  </div>

                  {/* Middle Row: Card Number */}
                  <div className="relative z-10 my-2">
                    <p className="font-mono text-xl tracking-widest font-bold drop-shadow-md">
                      {c.cardNumber}
                    </p>
                  </div>

                  {/* Bottom Row: Holder & Expiry */}
                  <div className="flex items-center justify-between relative z-10 text-xs">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-stone-300 font-bold">Cardholder</p>
                      <p className="font-bold tracking-wider font-mono truncate max-w-[150px]">{c.cardHolder}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-stone-300 font-bold">Expires</p>
                      <p className="font-bold font-mono">{c.expiry}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(c.id)}
                      className="p-1.5 bg-black/40 hover:bg-red-600 rounded-lg text-stone-300 hover:text-white transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white font-['Outfit']">Delivery Addresses</h3>
                <p className="text-xs text-stone-400 mt-0.5">Save your frequent drop-off locations for rapid ordering.</p>
              </div>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 transition-all space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs font-bold">
                      {addr.label}
                    </span>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{addr.recipientName}</p>
                    <p className="text-xs text-stone-400">{addr.phone}</p>
                    <p className="text-xs text-stone-300 mt-2">
                      {addr.house}, {addr.street}
                    </p>
                    <p className="text-xs text-stone-400">
                      {addr.area}, {addr.city} {addr.postalCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">Personal Information</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.displayName || 'Customer'}
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-stone-300"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || 'guest@smashandsizzle.com'}
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-stone-300"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-400 block mb-1">Membership Tier</label>
                <div className="p-4 bg-orange-950/30 border border-orange-500/30 rounded-2xl flex items-center justify-between text-orange-300">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <div>
                      <p className="font-bold text-sm text-white">Sizzle Gold Member</p>
                      <p className="text-[11px] text-stone-400">Earn 10 points for every dollar spent.</p>
                    </div>
                  </div>
                  <span className="font-black text-amber-300 text-sm">450 PTS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddCardOpen(false)} />
          <div className="relative w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl p-7 shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold font-['Outfit']">Add New Payment Card</h3>
            <form onSubmit={handleAddCard} className="space-y-3 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Card Number (16 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4532 8920 1234 5678"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  className="w-full px-4 py-2.5 glass-input rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddAddressOpen(false)} />
          <div className="relative w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl p-7 shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold font-['Outfit']">Add New Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Label (e.g. Home, Office)</label>
                <input
                  type="text"
                  required
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-4 py-2.5 glass-input rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">House/Flat</label>
                  <input
                    type="text"
                    required
                    placeholder="Apt 2B"
                    value={newAddress.house}
                    onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">Street</label>
                  <input
                    type="text"
                    required
                    placeholder="Main St"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
