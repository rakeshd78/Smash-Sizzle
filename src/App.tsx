import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { Product, CartItem } from './types';
import { initialProducts } from './data/initialProducts';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTracking } from './pages/OrderTracking';
import { InfoPages } from './pages/InfoPages';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<{ view: string; id?: string }>(() => {
    // Check if user navigated directly to /admin or #/admin or #admin
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin')) {
      return { view: 'admin' };
    }
    return { view: 'home' };
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smash_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Promo state
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // External payment URL config
  const [externalPaymentUrl, setExternalPaymentUrl] = useState('https://pay.example.com/checkout');

  // Listen to browser URL changes for secret /admin route
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setCurrentView({ view: 'admin' });
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('smash_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const list: Product[] = [];
      querySnapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Product);
      });

      if (list.length === 0) {
        // Fallback to initial products directly without unauthorized writes
        setProducts(initialProducts.map((p, idx) => ({ id: `p-${idx}`, ...p })));
      } else {
        setProducts(list);
      }
    } catch (err) {
      console.warn("Using offline menu catalog:", err);
      setProducts(initialProducts.map((p, idx) => ({ id: `p-${idx}`, ...p })));
    }
  };


  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'config'));
      if (docSnap.exists() && docSnap.data().externalPaymentUrl) {
        setExternalPaymentUrl(docSnap.data().externalPaymentUrl);
      }
    } catch (err) {
      console.error("Error fetching settings", err);
    }
  };

  const handleGuestLogin = () => {
    const guest = {
      uid: 'guest-' + Date.now(),
      displayName: 'Guest Foodie',
      email: 'guest@smashandsizzle.com',
      isAnonymous: true,
    };
    setUser(guest);
  };

  const [cartNotification, setCartNotification] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setCurrentView({ view: 'home' });
  };

  const handleAddToCart = (product: Product, quantity = 1, options?: Record<string, string>) => {
    const optionKey = options ? Object.entries(options).map(([k, v]) => `${k}:${v}`).join('|') : 'default';
    const cartItemId = `${product.id}-${optionKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            selectedOptions: options,
          },
        ];
      }
    });

    // Notify user unobtrusively without opening the drawer
    setCartNotification({
      message: `Added "${product.name}" to your tray`,
      show: true,
    });
    setTimeout(() => {
      setCartNotification((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromo = (code: string) => {
    if (code.trim().toUpperCase() === 'SIZZLE30') {
      setDiscountPercent(20);
      setPromoApplied('SIZZLE30');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try SIZZLE30');
      setPromoApplied('');
      setDiscountPercent(0);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 30 || promoApplied === 'SIZZLE30' ? 0 : 3.99;
  const tax = subtotal * 0.08;
  const discount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigateTo = (view: string, id?: string) => {
    setCurrentView({ view, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-stone-100 font-['Plus_Jakarta_Sans'] selection:bg-orange-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView.view}
        setCurrentView={navigateTo}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView.view === 'home' && (
          <Home
            products={products}
            setCurrentView={navigateTo}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentView.view === 'shop' && (
          <Shop
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            setCurrentView={navigateTo}
          />
        )}

        {currentView.view === 'product-detail' && (
          <ProductDetail
            productId={currentView.id || ''}
            products={products}
            onAddToCart={handleAddToCart}
            setCurrentView={navigateTo}
          />
        )}

        {currentView.view === 'checkout' && (
          <Checkout
            cart={cart}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            discount={discount}
            total={total}
            user={user}
            externalPaymentUrl={externalPaymentUrl}
            setCurrentView={navigateTo}
            clearCart={() => setCart([])}
          />
        )}

        {currentView.view === 'order-confirmation' && (
          <OrderConfirmation
            orderId={currentView.id || ''}
            setCurrentView={navigateTo}
          />
        )}

        {currentView.view === 'tracking' && (
          <OrderTracking
            user={user}
            initialOrderId={currentView.id}
            setCurrentView={navigateTo}
          />
        )}

        {currentView.view === 'user-dashboard' && (
          <UserDashboard
            user={user}
            setCurrentView={navigateTo}
            onSignOut={handleSignOut}
          />
        )}

        {currentView.view === 'admin' && (
          <AdminDashboard
            user={user}
            products={products}
            refreshProducts={fetchProducts}
            externalPaymentUrl={externalPaymentUrl}
            setExternalPaymentUrl={setExternalPaymentUrl}
            setCurrentView={navigateTo}
          />
        )}

        {(currentView.view === 'about' ||
          currentView.view === 'contact' ||
          currentView.view === 'faq' ||
          currentView.view === 'privacy' ||
          currentView.view === 'terms' ||
          currentView.view === 'shipping' ||
          currentView.view === 'returns') && (
          <InfoPages view={currentView.view} setCurrentView={navigateTo} />
        )}
      </main>

      {/* Footer (No Admin buttons) */}
      <Footer setCurrentView={navigateTo} />

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        discount={discount}
        total={total}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        applyPromo={applyPromo}
        promoError={promoError}
        promoApplied={promoApplied}
        setCurrentView={navigateTo}
      />

      {/* Auth Modal (Google, Email/Password, Guest) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGuestLogin={handleGuestLogin}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Unobtrusive Add to Cart Floating Notification */}
      {cartNotification.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-stone-900/95 border border-orange-500/50 text-white rounded-2xl shadow-2xl backdrop-blur-xl animate-bounce-once">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold">{cartNotification.message}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-2.5 py-1 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Open Cart ({cartCount})
          </button>
        </div>
      )}
    </div>
  );
}
