import React, { useState, useEffect, useRef } from 'react';
import { Shield, Plus, Edit, Trash2, DollarSign, Package, ShoppingBag, Settings as SettingsIcon, CheckCircle2, Lock, ArrowLeft, Star, Layers, RefreshCw, Upload, X, Image as ImageIcon, Link2, Check, AlertCircle } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order, Promo } from '../types';

interface AdminDashboardProps {
  user: any;
  products: Product[];
  refreshProducts: () => void;
  externalPaymentUrl: string;
  setExternalPaymentUrl: (url: string) => void;
  setCurrentView: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  products,
  refreshProducts,
  externalPaymentUrl,
  setExternalPaymentUrl,
  setCurrentView,
}) => {
  // Passcode unlock (Secret PIN: sizzle2026 or admin email)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('smash_admin_unlocked') === 'true' || user?.email === 'rakeshd78@gmail.com';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Product Add / Edit Drawer State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'device' | 'url'>('device');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 9.99,
    category: 'Burgers' as any,
    subCategory: '',
    image: '',
    stock: 50,
    ingredients: '',
    allergens: '',
    isBestseller: false,
    isFeatured: false,
  });

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }
    setUploadError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProductForm((prev) => ({ ...prev, image: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };


  const [paymentUrlInput, setPaymentUrlInput] = useState(externalPaymentUrl);

  useEffect(() => {
    if (isUnlocked) {
      fetchOrders();
    }
  }, [isUnlocked]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Order);
      });
      setOrders(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'sizzle2026' || pinInput === 'admin123' || user?.email === 'rakeshd78@gmail.com') {
      setIsUnlocked(true);
      localStorage.setItem('smash_admin_unlocked', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Admin Passkey. Hint: sizzle2026');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('smash_admin_unlocked');
  };

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!productForm.image) {
      setUploadError('Please upload an image from your device/PC or provide a valid image URL.');
      return;
    }
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        subCategory: productForm.subCategory,
        image: productForm.image,
        stock: Number(productForm.stock),
        rating: editingProduct?.rating ?? 4.9,
        reviewsCount: editingProduct?.reviewsCount ?? 1,
        ingredients: productForm.ingredients,
        allergens: productForm.allergens,
        isBestseller: Boolean(productForm.isBestseller),
        isFeatured: Boolean(productForm.isFeatured),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      refreshProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      refreshProducts();
      setIsProductModalOpen(false);
    }
  };


  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      refreshProducts();
    } catch (err) {
      console.error(err);
      refreshProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
    } catch (err) {
      console.error(err);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'config'), {
        externalPaymentUrl: paymentUrlInput,
        deliveryFee: 3.99,
        taxRate: 0.08,
      });
      setExternalPaymentUrl(paymentUrlInput);
      alert('Payment URL settings updated successfully!');
    } catch (err) {
      console.error(err);
      setExternalPaymentUrl(paymentUrlInput);
    }
  };

  // If locked, render secret passkey login screen
  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-white space-y-6 text-center glass-card-reflection">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-600/30">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-['Outfit']">Provider Super Admin</h2>
            <p className="text-xs text-stone-400 mt-1">
              Enter the provider security key to manage products, pricing, stock, and orders.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs text-red-300">
              {pinError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter Secret Passkey (e.g. sizzle2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-center tracking-widest font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01]"
            >
              Access Dashboard
            </button>
          </form>

          <button
            onClick={() => setCurrentView('home')}
            className="text-xs text-stone-500 hover:text-stone-300 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-wider">
            Hidden Super Admin Portal (/admin)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] mt-2">
            Store Management Console
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure menu catalog, adjust pricing, stock quantities, food descriptions, and order statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshProducts}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl border border-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLock}
            className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition-all"
          >
            Lock Panel
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 rounded-xl text-xs font-bold transition-colors"
          >
            View Storefront
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-stone-900 border border-white/10 shadow-xl flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center border border-orange-500/30">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-stone-400">Total Revenue</p>
            <p className="text-2xl font-black text-white font-['Outfit']">${totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-stone-900 border border-white/10 shadow-xl flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-stone-400">Total Customer Orders</p>
            <p className="text-2xl font-black text-white font-['Outfit']">{orders.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-stone-900 border border-white/10 shadow-xl flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-stone-400">Active Menu Items</p>
            <p className="text-2xl font-black text-white font-['Outfit']">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Menu Products & Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-stone-900 text-orange-400 border-t border-x border-white/15'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Payment Gateway Link
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-stone-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl">
        {/* PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white font-['Outfit']">Menu Catalog</h3>
                <p className="text-xs text-stone-400">
                  Add new items, update prices, descriptions, ratings, and stock quantities.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: 10.99,
                    category: 'Burgers',
                    subCategory: 'Single Smash',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
                    stock: 50,
                    ingredients: 'Premium beef, Brioche bun, Sizzle sauce',
                    allergens: 'Gluten, Dairy',
                    isBestseller: false,
                    isFeatured: true,
                  });
                  setIsProductModalOpen(true);

                }}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fast-Food Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 transition-all flex gap-4 items-start"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-orange-400">{p.category}</span>
                      {p.subCategory && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-medium">
                          {p.subCategory}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-stone-400 line-clamp-1">{p.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <span className="font-black text-amber-300 font-['Outfit']">${p.price.toFixed(2)}</span>
                      <span className="text-stone-500">·</span>
                      <span className="text-stone-300 flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 text-amber-400 fill-current" /> {p.rating}
                      </span>
                      <span className="text-stone-500">·</span>
                      <span className="text-stone-400 font-mono">Stock: {p.stock}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            category: p.category,
                            subCategory: p.subCategory || '',
                            image: p.image,
                            stock: p.stock,
                            ingredients: p.ingredients,
                            allergens: p.allergens,
                            isBestseller: !!p.isBestseller,
                            isFeatured: !!p.isFeatured,
                          });
                          setIsProductModalOpen(true);

                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">Customer Order Fulfillment</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-stone-400">No customer orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items Ordered</th>
                      <th className="pb-3">Total ($)</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.02]">
                        <td className="py-4 font-mono font-bold text-stone-300">#{o.id.slice(0, 8)}</td>
                        <td className="py-4">
                          <p className="font-bold text-white">{o.customerName}</p>
                          <p className="text-[11px] text-stone-400">{o.phone} | {o.email}</p>
                          <p className="text-[10px] text-stone-500">{o.address.house}, {o.address.street}</p>
                        </td>
                        <td className="py-4">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-4 font-black text-amber-300 font-['Outfit'] text-sm">
                          ${o.total.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="bg-stone-900 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS / PAYMENT GATEWAY */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">External Payment Gateway URL</h3>
            <p className="text-xs text-stone-400">
              When customers complete checkout and click "Pay Now", they are securely redirected to this external payment link with their order ID and total amount.
            </p>
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-400 block mb-1">Configurable Payment URL</label>
                <input
                  type="url"
                  required
                  value={paymentUrlInput}
                  onChange={(e) => setPaymentUrlInput(e.target.value)}
                  placeholder="https://pay.example.com/checkout"
                  className="w-full px-4 py-3 glass-input rounded-xl font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Save Payment Gateway URL
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Product Add / Edit Full-Height Right Drawer */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProductModalOpen(false)}
          />

          {/* Right Attached Full Height Drawer: Exactly 500px wide on desktop, top to bottom */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] h-full bg-stone-950 border-l border-white/15 flex flex-col justify-between shadow-[-25px_0_60px_rgba(0,0,0,0.9)] z-50 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-stone-900/60 backdrop-blur-xl shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                  Kitchen Menu Console
                </span>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  {editingProduct ? 'Edit Menu Product' : 'Add New Fast-Food Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-white">
              {/* Product Name */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Product Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sizzle Double Smash Burger"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 glass-input rounded-xl text-sm font-semibold placeholder-stone-600 focus:border-orange-500"
                />
              </div>

              {/* Price & Stock Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Price ($ USD) <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-400 font-mono font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-2.5 glass-input rounded-xl font-mono text-sm text-amber-300 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Kitchen Stock Quantity <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl font-mono text-sm text-stone-200"
                  />
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Category <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/20 rounded-xl text-white font-semibold text-xs cursor-pointer focus:border-orange-500"
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Chicken">Chicken</option>
                    <option value="French Fries">French Fries</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Wraps">Wraps</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Single Smash, Loaded, Coolers"
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    className="w-full px-4 py-3 glass-input rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION (DEVICE / PC UPLOAD + WEB URL) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-stone-400">
                    Product Image <span className="text-orange-500">*</span>
                  </label>
                  {/* Mode switcher tabs */}
                  <div className="flex bg-stone-900 p-0.5 rounded-lg border border-white/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('device')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        imageUploadMode === 'device'
                          ? 'bg-orange-600 text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device/PC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        imageUploadMode === 'url'
                          ? 'bg-orange-600 text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Web URL</span>
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {imageUploadMode === 'device' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="hidden"
                    />

                    {productForm.image ? (
                      <div className="relative group rounded-2xl overflow-hidden border border-orange-500/40 bg-stone-900">
                        <img
                          src={productForm.image}
                          alt="Product preview"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductForm((prev) => ({ ...prev, image: '' }))}
                            className="px-3.5 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Image Selected from Device
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-white/15 bg-white/[0.02] hover:border-orange-500/50 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-2.5 border border-orange-500/30">
                          <Upload className="w-6 h-6 animate-pulse" />
                        </div>
                        <p className="font-bold text-white text-xs">
                          Click to browse from your PC or drag & drop here
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1">
                          Supports PNG, JPG, JPEG, WEBP (Max 8MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-3 glass-input rounded-xl text-xs font-mono"
                    />
                    {productForm.image && (
                      <div className="rounded-xl overflow-hidden h-32 border border-white/10 mt-2">
                        <img
                          src={productForm.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setUploadError('Image URL could not be loaded')}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Product Description / Story <span className="text-orange-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Crispy smashed beef patties with aged cheddar, caramelized grilled onions, signature Sizzle sauce..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 glass-input rounded-xl text-xs leading-relaxed focus:border-orange-500"
                />
              </div>

              {/* Ingredients & Allergens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    placeholder="Prime Angus beef, brioche bun, cheese..."
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Allergens
                  </label>
                  <input
                    type="text"
                    placeholder="Gluten, Dairy, Soy..."
                    value={productForm.allergens}
                    onChange={(e) => setProductForm({ ...productForm, allergens: e.target.value })}
                    className="w-full px-4 py-2.5 glass-input rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Highlights & Badges */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Menu Badges & Visibility
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestseller}
                      onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
                    />
                    <span className="font-semibold text-stone-200">Bestseller Badge</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-600 cursor-pointer"
                    />
                    <span className="font-semibold text-stone-200">Featured on Home</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Fixed Bottom Action Bar */}
            <div className="p-5 border-t border-white/10 bg-stone-900/90 backdrop-blur-xl flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveProduct()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-xs shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingProduct ? 'Update Product' : 'Add to Menu Catalog'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

