import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Clock, Flame, ChevronDown, LogOut, Package, CreditCard, Sparkles, UtensilsCrossed } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string, id?: string) => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  user: any;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  setIsCartOpen,
  user,
  onOpenAuthModal,
  onSignOut,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      {/* Top Sizzle Announcement Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white text-xs py-1.5 px-4 text-center font-bold tracking-wider relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
        <span className="relative flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-current animate-spin" />
          <span>FLAVOR EXPLOSION: FREE DELIVERY ON ORDERS OVER $30! CODE:</span>
          <span className="bg-black/35 px-2 py-0.5 rounded-md font-mono text-amber-300 tracking-widest font-black">
            SIZZLE30
          </span>
        </span>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Enhanced Brand Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3.5 text-left group shrink-0 cursor-pointer"
        >
          {/* Logo Insignia Badge */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-400 p-0.5 shadow-xl shadow-orange-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-amber-400/20" />
                <Flame className="w-6 h-6 text-orange-500 fill-current group-hover:text-amber-300 transition-colors animate-pulse" />
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 absolute bottom-1 right-1 opacity-80" />
              </div>
            </div>
            {/* Glowing dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-stone-950 shadow-md animate-ping" />
          </div>

          {/* Typography */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none font-['Outfit'] group-hover:text-orange-400 transition-colors">
                SMASH
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit']">&</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 block leading-none font-['Outfit']">
                SIZZLE
              </span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-stone-400 block mt-0.5 font-mono">
              Artisan Flat-Top Grill
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (EXACT ORDER: Home -> About Us -> Menu -> Contact) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-stone-300">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition-all hover:text-orange-400 whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
              currentView === 'home'
                ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500'
                : 'text-stone-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`transition-all hover:text-orange-400 whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
              currentView === 'about'
                ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500'
                : 'text-stone-300'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className={`transition-all hover:text-orange-400 whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
              currentView === 'shop' || currentView === 'category'
                ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500'
                : 'text-stone-300'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setCurrentView('contact')}
            className={`transition-all hover:text-orange-400 whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
              currentView === 'contact'
                ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500'
                : 'text-stone-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Right Controls (Track Order beside Search, Cart, User) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Track Order - Positioned on the right beside search */}
          <button
            onClick={() => setCurrentView('tracking')}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              currentView === 'tracking'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-md shadow-orange-500/20'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10 hover:border-orange-500/40'
            }`}
            title="Track Your Order"
          >
            <Clock className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
            <span className="whitespace-nowrap">Track Order</span>
          </button>

          {/* Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search smash burgers, pizzas..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'shop') setCurrentView('shop');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setCurrentView('shop');
                  }}
                  autoFocus
                  className="w-48 sm:w-60 px-3.5 py-2 text-xs bg-stone-900 border border-orange-500/50 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-stone-300 hover:text-orange-400 hover:bg-white/5 rounded-xl border border-white/10 transition-colors cursor-pointer"
                title="Search Menu"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Shopping Cart Tray"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span className="hidden md:inline font-['Outfit'] uppercase tracking-wider">Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-orange-600 text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-md min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-lg object-cover border border-orange-500/40" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-stone-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50 text-stone-200"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{user.displayName || 'Sizzle Member'}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user.email || 'Guest Session'}</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('user-dashboard')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-white/10 hover:text-orange-400 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    <span>My Account & Cards</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('tracking')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-white/10 hover:text-orange-400 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-orange-400" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 font-semibold flex items-center gap-2 border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-md cursor-pointer"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-white/10 px-6 py-5 space-y-4">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-stone-200 hover:text-orange-400"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-stone-200 hover:text-orange-400"
          >
            About Us
          </button>
          <button
            onClick={() => { setCurrentView('shop'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-stone-200 hover:text-orange-400"
          >
            Menu
          </button>
          <button
            onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-stone-200 hover:text-orange-400"
          >
            Contact
          </button>
          <button
            onClick={() => { setCurrentView('tracking'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-bold text-orange-400 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Track Order</span>
          </button>
          {user ? (
            <button
              onClick={() => { setCurrentView('user-dashboard'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-bold text-stone-200 hover:text-orange-400"
            >
              My Account & Saved Cards
            </button>
          ) : (
            <button
              onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs text-center"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};
