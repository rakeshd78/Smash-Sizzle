import React, { useState, useEffect } from 'react';
import {
  Flame, ArrowRight, ShieldCheck, Clock, Award, Star, ChevronRight,
  Sparkles, Copy, Check, Gift, Zap, UtensilsCrossed, ThermometerSun,
  TrendingUp, SlidersHorizontal, Layers, CheckCircle2, Heart,
  Package, Box, Plus, RefreshCw, Eye
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  setCurrentView: (view: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  products,
  setCurrentView,
  onAddToCart,
  setSelectedCategory,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  // Interactive Hero Featured Switcher (Super Unique Feature!)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Interactive Combo Builder State (New Custom Feature!)
  const [comboMain, setComboMain] = useState("The Ultimate Smash Burger");
  const [comboSide, setComboSide] = useState("Smothered Volcano Cheese Fries");
  const [comboDrink, setComboDrink] = useState("Glossy Oreo Velvet Milkshake");
  const [comboAdded, setComboAdded] = useState(false);

  // Bestsellers Interactive Category Filter Tab
  const [bestsellerCategory, setBestsellerCategory] = useState<string>('All');


  const heroDishes = [
    {
      title: "The Ultimate Smash Burger",
      tagline: "Double Prime Angus · Caramelized Lace Crust",
      price: 11.99,
      calories: "780 kcal",
      temp: "450°F Flat-Top",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
      description: "Two crispy smashed Angus beef patties, double aged cheddar, caramelized onions, dill pickles, and signature Sizzle glaze on toasted glossy brioche.",
      category: "Burgers",
    },
    {
      title: "Nashville Firecracker Hot Chicken",
      tagline: "Double Buttermilk Crust · Blazing Chili Dip",
      price: 11.49,
      calories: "690 kcal",
      temp: "Crispy Sizzle",
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=1000&q=80",
      description: "Crispy fried chicken breast dipped in blazing cayenne hot chili oil, loaded with creamy vinegar slaw, garlic pickles, and ghost pepper mayo.",
      category: "Chicken",
    },
    {
      title: "Smothered Volcano Cheese Fries",
      tagline: "Molten Smoked Cheddar · Charred Jalapeño",
      price: 8.49,
      calories: "540 kcal",
      temp: "Molten Fondue",
      image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1000&q=80",
      description: "Mountain of crispy fries drenched in molten hot smoked cheddar fondue, chopped crispy bacon bits, and charred jalapeño coins.",
      category: "French Fries",
    },
  ];

  // Countdown timer for 100% Offer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SIZZLE30');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 5000);
    }
  };

  // Categories with non-rounded creative rectangular / chamfered showcase cards
  const categories = [
    {
      name: 'Burgers',
      sub: 'Single, Double & Truffle',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Bestseller',
    },
    {
      name: 'Beverages',
      sub: 'Shakes, Sodas & Coolers',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      badge: 'Cold & Chilled',
    },
    {
      name: 'French Fries',
      sub: 'Loaded Truffle & Rings',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      badge: 'Triple Cooked',
    },
    {
      name: 'Chicken',
      sub: 'Nashville Hot & Wings',
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
      badge: 'Extra Crispy',
    },
    {
      name: 'Pizzas',
      sub: 'Sourdough & Pepperoni',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
      badge: 'Stone Baked',
    },
    {
      name: 'Desserts',
      sub: 'Molten Lava Cakes',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      badge: 'Sweet Finish',
    },
  ];

  const comboOptions = {
    mains: [
      { name: "The Ultimate Smash Burger", price: 11.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", tag: "Double Patty" },
      { name: "Black Truffle & Bacon Sizzle", price: 13.99, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80", tag: "Truffle Aioli" },
      { name: "Nashville Firecracker Hot Chicken", price: 11.49, image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80", tag: "Crispy Cayenne" },
      { name: "Spicy Diavola Pepperoni Pizza", price: 16.49, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", tag: "Hot Honey Drizzle" },
    ],
    sides: [
      { name: "Smothered Volcano Cheese Fries", price: 8.49, image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80", tag: "Molten Cheddar" },
      { name: "Golden Hand-Cut Truffle Fries", price: 5.49, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", tag: "Parmesan Truffle" },
      { name: "Beer-Battered Crisp Onion Rings", price: 5.99, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80", tag: "IPA Crunch" },
      { name: "Crispy Korean Sticky Wings", price: 13.49, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80", tag: "Gochujang Glaze" },
    ],
    drinks: [
      { name: "Glossy Oreo Velvet Milkshake", price: 7.29, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", tag: "Hand-Spun" },
      { name: "Wild Strawberry Sunset Shake", price: 7.29, image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80", tag: "Fresh Berry" },
      { name: "Molten Dark Chocolate Lava Cake", price: 7.99, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", tag: "Warm Lava" },
      { name: "Iced Sizzle Sparkler (Zero Sugar)", price: 4.49, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", tag: "Blood Orange" },
    ]
  };

  const handleAddComboToCart = () => {
    const selectedMainObj = comboOptions.mains.find(m => m.name === comboMain) || comboOptions.mains[0];
    const selectedSideObj = comboOptions.sides.find(s => s.name === comboSide) || comboOptions.sides[0];
    const selectedDrinkObj = comboOptions.drinks.find(d => d.name === comboDrink) || comboOptions.drinks[0];

    const comboProduct: Product = {
      id: `combo-${Date.now()}`,
      name: `Sizzle Tri-Box: ${selectedMainObj.name.split(' ')[0]} + ${selectedSideObj.name.split(' ')[0]} + ${selectedDrinkObj.name.split(' ')[0]}`,
      price: 19.99,
      image: selectedMainObj.image,
      description: `Signature 3-Course Feast: ${selectedMainObj.name}, ${selectedSideObj.name}, and ${selectedDrinkObj.name}. Bundle savings of $7+ applied!`,
      category: "Burgers",
      stock: 50,
      rating: 5.0,
      reviewsCount: 312,
      ingredients: `${selectedMainObj.name}, ${selectedSideObj.name}, ${selectedDrinkObj.name}`,
      allergens: "Gluten, Dairy",
      isBestseller: true,
      isFeatured: true,
    };

    onAddToCart(comboProduct);
    setComboAdded(true);
    setTimeout(() => setComboAdded(false), 2500);
  };

  // Expanded bestsellers with category filter support
  const allBestsellers = products.filter((p) => p.isBestseller || p.isFeatured || p.rating >= 4.8);
  const filteredBestsellers = bestsellerCategory === 'All'
    ? allBestsellers
    : allBestsellers.filter((p) => {
        if (bestsellerCategory === 'Beverages') return p.category === 'Beverages' || p.category === 'Desserts';
        return p.category === bestsellerCategory;
      });

  const currentHeroDish = heroDishes[activeHeroIndex];


  return (
    <div className="space-y-28 pb-28 text-white w-full">
      {/* UNIQUE INTERACTIVE HERO SECTION WITH LIVE DISH SWITCHER */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-white/10 bg-gradient-to-b from-stone-950 via-[#0a0a0a] to-[#080808]">
        {/* Ambient Neon Atmosphere */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Content: 7 Cols */}
          <div className="lg:col-span-7 space-y-7">
            {/* Top Pill with Live Grill Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600/20 border border-orange-500/40 rounded-full text-orange-400 text-xs font-black tracking-widest uppercase backdrop-blur-xl shadow-lg shadow-orange-600/20">
                <Flame className="w-4 h-4 fill-current text-amber-300 animate-pulse" />
                <span>FLAT-TOP GRILL SEARING LIVE</span>
              </span>
              <span className="text-xs text-stone-400 font-mono font-bold flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <ThermometerSun className="w-3.5 h-3.5 text-amber-400" /> Cast Iron 450°F
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-['Outfit'] text-white">
              Smashed Ultra Thin. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-300">
                Loaded With Sizzle.
              </span>
            </h1>

            {/* Dynamic Selected Dish Info */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3 glass-card-reflection max-w-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
                  {currentHeroDish.tagline}
                </span>
                <span className="text-2xl font-black text-amber-300 font-['Outfit']">
                  ${currentHeroDish.price.toFixed(2)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                {currentHeroDish.title}
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                {currentHeroDish.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const prod = products.find((p) => p.name.includes(currentHeroDish.title.split(' ')[0])) || products[0];
                  if (prod) onAddToCart(prod);
                }}
                className="px-9 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/40 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
              >
                <span>Add {currentHeroDish.title.split(' ')[0]} to Tray</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('shop')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-2xl font-bold text-sm backdrop-blur-xl transition-all cursor-pointer hover:border-orange-500/40"
              >
                Explore Full Menu
              </button>
            </div>

            {/* Interactive Hero Dish Switcher Tabs */}
            <div className="space-y-2 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                Switch Featured Sizzle Creation:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {heroDishes.map((dish, idx) => (
                  <button
                    key={dish.title}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      activeHeroIndex === idx
                        ? 'bg-orange-500/20 text-amber-300 border-orange-500 shadow-md shadow-orange-500/20 scale-105'
                        : 'bg-white/5 text-stone-400 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {idx === 0 ? '🍔 Smash Burger' : idx === 1 ? '🍗 Hot Chicken' : '🍟 Loaded Fries'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Image Card (5 Cols) with Smooth Floating Animation & Glow */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Glowing Sizzle Aura */}
            <div className="absolute w-[380px] h-[380px] bg-gradient-to-tr from-orange-600/30 via-red-600/25 to-amber-500/20 rounded-full blur-[90px] animate-pulse pointer-events-none" />

            {/* Orbiting Floating Badges */}
            <div className="absolute -top-4 -left-4 z-20 bg-stone-900/90 backdrop-blur-xl border border-orange-500/40 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-float-slow hidden sm:flex">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[11px] font-bold text-amber-300">100% Fresh Angus Beef</span>
            </div>

            <div className="absolute top-1/2 -right-6 z-20 bg-stone-900/90 backdrop-blur-xl border border-white/20 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-float-slow hidden sm:flex [animation-delay:2s]">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-bold text-stone-200">Sizzling Caramelized Crust</span>
            </div>

            <div className="relative w-full max-w-lg aspect-square rounded-[40px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(234,88,12,0.3)] border-2 border-white/20 group glass-card-reflection bg-stone-900 animate-float-slow">
              <img
                src={currentHeroDish.image}
                alt={currentHeroDish.title}
                key={currentHeroDish.image}
                className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

              {/* Holographic Badge in Corner */}
              <div className="absolute top-5 right-5 bg-black/85 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-amber-300">{currentHeroDish.temp}</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-stone-950/90 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 flex items-center justify-between shadow-2xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 block font-mono">
                    Chef's Daily Pick
                  </span>
                  <p className="text-white font-black text-lg font-['Outfit']">{currentHeroDish.title}</p>
                  <p className="text-amber-400 font-black text-sm">${currentHeroDish.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    const prod = products.find((p) => p.name.includes(currentHeroDish.title.split(' ')[0])) || products[0];
                    if (prod) onAddToCart(prod);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Quick Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE MENU CATEGORIES - UNIQUE CHISELED / RECTANGULAR SHOWCASE CARDS (NO ROUNDED FULL!) */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-orange-500">Curated Sections</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] mt-1">Explore Menu Categories</h2>
          </div>
          <button
            onClick={() => { setSelectedCategory('All'); setCurrentView('shop'); }}
            className="text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Left Category Filter View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Unique Rectangular Beveled Cards (Non-rounded images as requested) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => { setSelectedCategory(cat.name); setCurrentView('shop'); }}
              className="group bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer transition-all duration-300 flex flex-col overflow-hidden glass-card-reflection"
            >
              {/* Distinctive Rectangular Card Media Window (NOT CIRCULAR) */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-950">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-orange-600/80 text-white backdrop-blur-md border border-white/20">
                  {cat.badge}
                </span>
              </div>

              {/* Title & Subtitle Card Base */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-1 text-left">
                <h3 className="font-black text-white text-base group-hover:text-orange-400 transition-colors font-['Outfit']">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-400 line-clamp-1">{cat.sub}</p>
                <div className="pt-3 flex items-center gap-1 text-[11px] font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore items</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ULTRA-CREATIVE 100% SIZZLE SPECIAL OFFER SECTION */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-[40px] p-8 sm:p-14 bg-gradient-to-br from-stone-950 via-[#140b06] to-[#0a0a0a] border border-orange-500/30 shadow-2xl overflow-hidden glass-card-reflection">
          {/* Radiant Neon Embers in backdrop */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 cols: Content & Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-200" /> 100% SIZZLE GUARANTEE
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                  <Clock className="w-3.5 h-3.5" /> Closes in {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] leading-tight">
                Get $10 Off + 100% Free Express Delivery!
              </h3>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Experience pure perfection: <strong className="text-orange-400">100% Fresh Angus Beef</strong>, <strong className="text-orange-400">100% Artisan Brioche</strong>, and <strong className="text-orange-400">100% Satisfaction Guarantee</strong>. Use the limited-time VIP voucher below.
              </p>

              {/* 3 Creative 100% Guarantee Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <span className="text-2xl font-black text-amber-400 font-['Outfit']">100%</span>
                  <p className="text-[11px] font-bold leading-tight text-stone-200">Fresh Angus<br />Never Frozen</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <span className="text-2xl font-black text-orange-400 font-['Outfit']">100%</span>
                  <p className="text-[11px] font-bold leading-tight text-stone-200">Crispy Gold<br />Triple Cooked</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <span className="text-2xl font-black text-red-400 font-['Outfit']">100%</span>
                  <p className="text-[11px] font-bold leading-tight text-stone-200">Taste & Heat<br />Guarantee</p>
                </div>
              </div>

              {/* Interactive Coupon Box */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center gap-3 bg-stone-900/90 border border-orange-500/50 rounded-2xl p-2.5 px-4 shadow-xl">
                  <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Promo Code:</span>
                  <span className="font-mono font-black text-lg text-amber-300 tracking-widest">SIZZLE30</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Copy Coupon"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-7 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black text-xs shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Apply & Browse Menu
                </button>
              </div>
            </div>

            {/* Right 5 cols: Gorgeous Sizzling Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 sm:aspect-square rounded-[32px] overflow-hidden shadow-2xl border-2 border-orange-500/30 group">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                  alt="Sizzling Bacon Cheeseburger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-white/15 px-4 py-2 rounded-2xl text-center shadow-2xl">
                  <p className="text-[10px] uppercase font-bold text-stone-400">Special Discount</p>
                  <p className="text-xl font-black text-amber-300 font-['Outfit']">SAVE 20%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. MOST POPULAR & TRENDING CRAVE-LIST SECTION */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>Real-Time Popularity Radar</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] mt-1">
              Most Popular Crave-List
            </h2>
          </div>
          <p className="text-xs text-stone-400 max-w-md sm:text-right">
            The most frequently ordered sizzling creations coming off our flat-top grills right now, backed by live kitchen orders.
          </p>
        </div>

        {/* Popular Grid: 7 cols spotlight hero + 5 cols trending stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Spotlight #1 Trending Item */}
          <div className="lg:col-span-7 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-[36px] border border-orange-500/30 p-7 sm:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden glass-card-reflection group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>#1 TRENDING DISH NATIONWIDE</span>
                </div>
                <span className="text-xs text-stone-400 font-mono">1,840+ ordered this week</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                    The Ultimate Smash Burger
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">Double 80/20 Angus · Caramelized Lace · Brioche</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-300 font-['Outfit']">$11.99</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Two ultra-crispy smashed Angus beef patties seared on screaming hot steel, melted aged cheddar, caramelized onions, dill pickles, and signature Sizzle sauce on glossy brioche.
              </p>

              {/* Flavor Profile Bars */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Crispy Lace</span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-[98%]" />
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Angus Juiciness</span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full w-[95%]" />
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Melty Cheddar</span>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Media & Quick Action */}
            <div className="pt-6 relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-1/2 aspect-16/10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
                  alt="The Ultimate Smash Burger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="w-full sm:w-1/2 space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9 / 5.0</span>
                  <span className="text-stone-500">(184 Reviews)</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.name.includes("Ultimate Smash")) || products[0];
                      if (prod) onAddToCart(prod);
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Quick Add ($11.99)</span>
                  </button>
                  <button
                    onClick={() => {
                      const prod = products.find((p) => p.name.includes("Ultimate Smash")) || products[0];
                      if (prod) setCurrentView('product-detail', prod.id);
                    }}
                    className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: 3 Trending Companions */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {[
              {
                rank: "02",
                name: "Nashville Firecracker Hot Chicken",
                price: 11.49,
                sub: "Double Buttermilk Crust · Cayenne Chili Oil",
                rating: 4.9,
                orders: "1,240 sold",
                image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80",
                searchKey: "Nashville",
              },
              {
                rank: "03",
                name: "Smothered Volcano Cheese Fries",
                price: 8.49,
                sub: "Molten Smoked Cheddar · Charred Jalapeño",
                rating: 4.9,
                orders: "980 sold",
                image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=400&q=80",
                searchKey: "Volcano",
              },
              {
                rank: "04",
                name: "Glossy Oreo Velvet Milkshake",
                price: 7.29,
                sub: "Vanilla Bean · Crushed Cookies & Cream",
                rating: 5.0,
                orders: "1,450 sold",
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80",
                searchKey: "Oreo",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/40 transition-all flex items-center gap-4 group glass-card-reflection"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-stone-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/80 font-mono text-[9px] font-black text-amber-300">
                    #{item.rank}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-500 font-mono">{item.orders}</span>
                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm truncate font-['Outfit'] group-hover:text-orange-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1">{item.sub}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-amber-300 text-sm font-['Outfit']">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => {
                        const prod = products.find((p) => p.name.includes(item.searchKey)) || products[0];
                        if (prod) onAddToCart(prod);
                      }}
                      className="px-3.5 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BUILD YOUR OWN SIZZLE COMBO BOX (PREMIUM FEATURE) */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-[40px] p-8 sm:p-12 bg-gradient-to-br from-stone-950 via-[#100905] to-stone-950 border border-orange-500/30 shadow-2xl overflow-hidden glass-card-reflection">
          <div className="absolute -top-32 right-1/3 w-[500px] h-[300px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-600/30 to-amber-500/20 border border-orange-500/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-2">
                <Box className="w-3.5 h-3.5 text-orange-400" />
                <span>Chef's Custom Combo Crafter</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                Build Your Sizzle Tri-Box
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
                Combine 1 Sizzling Main + 1 Loaded Side + 1 Chilled Shake. Save up to <span className="text-amber-400 font-bold">$8.00 instantly</span> with our bundled combo pricing!
              </p>
            </div>

            {/* Pricing Badge */}
            <div className="bg-stone-900/90 border border-white/15 px-6 py-3 rounded-2xl text-right shrink-0 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Complete 3-Piece Box</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs line-through text-stone-500 font-mono">$27.77</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-['Outfit']">$19.99</span>
              </div>
            </div>
          </div>

          {/* 3 Step Selectors */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Pick Main */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Pick Your Main
                </span>
                <span className="text-[11px] text-stone-400 truncate max-w-[150px]">{comboMain}</span>
              </div>

              <div className="space-y-2">
                {comboOptions.mains.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setComboMain(item.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      comboMain === item.name
                        ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg shadow-orange-600/20'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-stone-300'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <span className="text-[10px] text-stone-400">{item.tag}</span>
                    </div>
                    {comboMain === item.name && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Pick Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Pick Your Side
                </span>
                <span className="text-[11px] text-stone-400 truncate max-w-[150px]">{comboSide}</span>
              </div>

              <div className="space-y-2">
                {comboOptions.sides.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setComboSide(item.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      comboSide === item.name
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-600/20'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-stone-300'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <span className="text-[10px] text-stone-400">{item.tag}</span>
                    </div>
                    {comboSide === item.name && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Pick Drink/Dessert */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">3</span>
                  Pick Your Drink or Sweet
                </span>
                <span className="text-[11px] text-stone-400 truncate max-w-[150px]">{comboDrink}</span>
              </div>

              <div className="space-y-2">
                {comboOptions.drinks.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setComboDrink(item.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      comboDrink === item.name
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-stone-300'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <span className="text-[10px] text-stone-400">{item.tag}</span>
                    </div>
                    {comboDrink === item.name && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Callout Bar */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-stone-300">
              <span className="font-bold text-white">Your Tri-Box:</span>
              <span className="truncate max-w-xs text-orange-400">{comboMain.split(' ')[0]} + {comboSide.split(' ')[0]} + {comboDrink.split(' ')[0]}</span>
            </div>

            <button
              onClick={handleAddComboToCart}
              className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {comboAdded ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Added Combo Box to Tray!</span>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5 text-amber-200" />
                  <span>Add Sizzle Tri-Box to Tray ($19.99)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3. EXPANDED SIZZLING BESTSELLERS WITH INTERACTIVE CATEGORY TABS */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">
              <Award className="w-4 h-4 text-orange-400" />
              <span>Customer-Approved Legends</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] mt-1">
              Sizzling Bestsellers
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Showing {filteredBestsellers.length} top-rated menu selections with over 4.8+ customer ratings.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'All', label: 'All Bestsellers' },
              { id: 'Burgers', label: 'Smash Burgers' },
              { id: 'Chicken', label: 'Crispy Chicken' },
              { id: 'French Fries', label: 'Loaded Fries' },
              { id: 'Pizzas', label: 'Artisan Pizzas' },
              { id: 'Beverages', label: 'Shakes & Sweets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBestsellerCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  bestsellerCategory === tab.id
                    ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/30'
                    : 'bg-stone-900/80 text-stone-400 border-white/10 hover:text-white hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={(id) => setCurrentView('product-detail', id)}
            />
          ))}
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 rounded-2xl font-bold text-xs backdrop-blur-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Entire Sizzle Menu Catalog ({products.length} Items)</span>
            <ChevronRight className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </section>

      {/* 4. FOUR-PILLAR ARTISAN STANDARDS (PREMIUM QUALITY COMMITMENTS) */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded-[36px] bg-stone-900/40 backdrop-blur-xl border border-white/10 space-y-8 glass-card-reflection">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-orange-400">
              The Artisan Sizzle Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Why Fast Food Never Tasted So Gourmet
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              We reject industrial warming drawers and frozen pucks. Every item is seared fresh to order within 4 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h4 className="font-bold text-white text-sm font-['Outfit']">450°F Seasoned Steel</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Heavy-iron smash technique forces immediate Maillard caramelization for signature lacy edges.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h4 className="font-bold text-white text-sm font-['Outfit']">100% Grass-Fed Angus</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Custom 80/20 chuck & brisket coarse grind made fresh daily. Zero antibiotics, zero hormones.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h4 className="font-bold text-white text-sm font-['Outfit']">Sweet Cream Brioche</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Artisan morning bake, buttered with clarified sweet cream and seared till golden and cloud-soft.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                04
              </div>
              <h4 className="font-bold text-white text-sm font-['Outfit']">Hot-Vented Thermal Trays</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Engineered thermal containers allow steam to vent while trapping intense heat for crispy delivery.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ULTRA-GLOSSY VIP CLUB SECTION WITH HOLOGRAPHIC GOLD CARD */}
      <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-[40px] p-8 sm:p-14 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.2)] overflow-hidden glass-card-reflection">
          {/* Ambient Glows */}
          <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[300px] bg-gradient-to-r from-orange-600/20 via-red-600/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 cols: Content & Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-black tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Private Loyalty Circle</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight">
                Join the VIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">Black & Gold Sizzle Club</span>
              </h3>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Elevate your burger rituals. Club members enjoy instant secret promo drops, invitations to private culinary tasting nights, zero delivery fees, and an instant welcome gift!
              </p>

              {subSuccess ? (
                <div className="p-5 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-300 font-bold text-sm flex items-center gap-3">
                  <Check className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-extrabold">Welcome to the Sizzle Inner Circle!</p>
                    <p className="text-xs text-emerald-400/80">Check your inbox for your $10 Welcome Voucher & Secret Menu Passcode.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-1">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    className="flex-1 px-5 py-4 glass-input rounded-2xl text-sm placeholder-stone-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-white/20"
                  >
                    Claim VIP Access Free
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>$10 Instant Food Voucher</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Friday Secret Off-Menu</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free Priority Delivery</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Holographic VIP Card Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-[1.58/1] rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-stone-900 via-black to-stone-950 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between group hover:border-amber-400 transition-all duration-500 animate-float-slow">
                {/* Gold foil metallic reflection shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500 fill-current" />
                    <span className="font-black text-white font-['Outfit'] tracking-wider text-sm">SMASH & SIZZLE</span>
                  </div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 font-mono">
                    VIP ELITE
                  </span>
                </div>

                <div className="relative z-10 my-auto">
                  <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-300/60 shadow flex items-center justify-center opacity-90 mb-2">
                    <div className="w-8 h-5 border border-black/30 rounded-xs" />
                  </div>
                  <p className="font-mono text-xs text-amber-200 tracking-widest">•••• •••• •••• 2026</p>
                </div>

                <div className="flex items-center justify-between relative z-10 text-[11px]">
                  <div>
                    <p className="text-[9px] uppercase text-stone-500 font-bold">MEMBER NAME</p>
                    <p className="font-bold text-white font-['Outfit']">HONORED GUEST</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase text-stone-500 font-bold">DISCOUNT TIER</p>
                    <p className="font-bold text-amber-400">UNLIMITED 15% OFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL INFINITE MARQUEE TESTIMONIALS (TWO OPPOSITE SCROLLING ROWS) */}
      <section className="w-full space-y-8 overflow-hidden py-6">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-orange-500">Real Foodie Reactions</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] mt-1">What Food Lovers Are Saying</h2>
          </div>
          <p className="text-xs text-stone-400 max-w-sm sm:text-right">
            Hover over any review to pause the stream and read diner experiences from across the country.
          </p>
        </div>

        {/* Row 1: Scrolling Left (animate-marquee) */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee pause-hover gap-6 py-2">
            {[
              {
                name: "Marcus Brody",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                role: "VIP Platinum Diner",
                city: "Los Angeles, CA",
                dish: "Ultimate Double Smash",
                text: "The lacy crispy edges on the Ultimate Smash Burger are unmatched. That crust locks in every drop of juice!",
              },
              {
                name: "Chef Sophia Rivera",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
                role: "Culinary Critic & Author",
                city: "Chicago, IL",
                dish: "Truffle Mushroom Smash",
                text: "The Maillard reaction and seasoning balance are Michelin-grade. That custom brioche bun stays pillowy soft.",
              },
              {
                name: "David Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                role: "Food Blogger & YouTuber",
                city: "Seattle, WA",
                dish: "Volcano Cheese Fries",
                text: "Oreo Velvet Milkshake and Volcano Fries are absolute perfection. Arrived in 24 minutes steaming hot!",
              },
              {
                name: "Maya Lin",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                role: "Corporate Catering Lead",
                city: "San Francisco, CA",
                dish: "Team Sizzle Box",
                text: "Ordered catering for our design agency. 45 burgers arrived sizzling hot in under 30 minutes. 10/10!",
              },
              {
                name: "Liam Foster",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                role: "Smash Club Member",
                city: "Austin, TX",
                dish: "Nashville Firecracker",
                text: "The secret house glaze has this smoky sweet umami tang that you literally find yourself craving at midnight.",
              },
              // Duplicate array items for seamless infinite loop
              {
                name: "Marcus Brody",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                role: "VIP Platinum Diner",
                city: "Los Angeles, CA",
                dish: "Ultimate Double Smash",
                text: "The lacy crispy edges on the Ultimate Smash Burger are unmatched. That crust locks in every drop of juice!",
              },
              {
                name: "Chef Sophia Rivera",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
                role: "Culinary Critic & Author",
                city: "Chicago, IL",
                dish: "Truffle Mushroom Smash",
                text: "The Maillard reaction and seasoning balance are Michelin-grade. That custom brioche bun stays pillowy soft.",
              },
              {
                name: "David Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                role: "Food Blogger & YouTuber",
                city: "Seattle, WA",
                dish: "Volcano Cheese Fries",
                text: "Oreo Velvet Milkshake and Volcano Fries are absolute perfection. Arrived in 24 minutes steaming hot!",
              },
              {
                name: "Maya Lin",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                role: "Corporate Catering Lead",
                city: "San Francisco, CA",
                dish: "Team Sizzle Box",
                text: "Ordered catering for our design agency. 45 burgers arrived sizzling hot in under 30 minutes. 10/10!",
              },
              {
                name: "Liam Foster",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                role: "Smash Club Member",
                city: "Austin, TX",
                dish: "Nashville Firecracker",
                text: "The secret house glaze has this smoky sweet umami tang that you literally find yourself craving at midnight.",
              },
            ].map((review, i) => (
              <div
                key={`row1-${i}`}
                className="w-[380px] shrink-0 p-6 rounded-3xl bg-stone-900/80 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 space-y-4 shadow-xl glass-card-reflection transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-white text-sm font-['Outfit']">{review.name}</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <p className="text-[10px] text-stone-400">{review.role} · {review.city}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "{review.text}"
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-orange-400 font-bold">Ordered: {review.dish}</span>
                  <span className="text-stone-500 font-mono">Verified Order</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right (animate-marquee-reverse) */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-reverse pause-hover gap-6 py-2">
            {[
              {
                name: "Sarah Jenkins",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
                role: "Verified Diner",
                city: "Portland, OR",
                dish: "Parmesan Truffle Fries",
                text: "Delivery was 22 minutes flat and the Truffle Fries were steaming hot. The packaging kept everything crisp!",
              },
              {
                name: "Elena Rostov",
                avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
                role: "Artisan Baker",
                city: "New York, NY",
                dish: "Double Sizzle Cheeseburger",
                text: "That custom brioche bun is golden perfection. Not soggy, not dry, pure glazed butter cloud with a crisp toast.",
              },
              {
                name: "Tyrone Washington",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
                role: "CrossFit Coach",
                city: "Denver, CO",
                dish: "Triple Monster Smash",
                text: "Post-workout meal done right! 100% prime chuck blend with clean fresh ingredients and high-protein punch.",
              },
              {
                name: "Chloe Montgomery",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                role: "Spice Enthusiast",
                city: "Nashville, TN",
                dish: "Nashville Firecracker",
                text: "The Nashville Hot Chicken has that authentic cayenne dipped crunch that makes your tastebuds sing!",
              },
              {
                name: "Kenji Tanaka",
                avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
                role: "Street Food Explorer",
                city: "Austin, TX",
                dish: "Oklahoma Onion Smash",
                text: "Real flat-top smash technique like the classic Oklahoma onion burgers, but modernized with genius glaze.",
              },
              // Duplicate array items for seamless infinite loop
              {
                name: "Sarah Jenkins",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
                role: "Verified Diner",
                city: "Portland, OR",
                dish: "Parmesan Truffle Fries",
                text: "Delivery was 22 minutes flat and the Truffle Fries were steaming hot. The packaging kept everything crisp!",
              },
              {
                name: "Elena Rostov",
                avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
                role: "Artisan Baker",
                city: "New York, NY",
                dish: "Double Sizzle Cheeseburger",
                text: "That custom brioche bun is golden perfection. Not soggy, not dry, pure glazed butter cloud with a crisp toast.",
              },
              {
                name: "Tyrone Washington",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
                role: "CrossFit Coach",
                city: "Denver, CO",
                dish: "Triple Monster Smash",
                text: "Post-workout meal done right! 100% prime chuck blend with clean fresh ingredients and high-protein punch.",
              },
              {
                name: "Chloe Montgomery",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
                role: "Spice Enthusiast",
                city: "Nashville, TN",
                dish: "Nashville Firecracker",
                text: "The Nashville Hot Chicken has that authentic cayenne dipped crunch that makes your tastebuds sing!",
              },
              {
                name: "Kenji Tanaka",
                avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
                role: "Street Food Explorer",
                city: "Austin, TX",
                dish: "Oklahoma Onion Smash",
                text: "Real flat-top smash technique like the classic Oklahoma onion burgers, but modernized with genius glaze.",
              },
            ].map((review, i) => (
              <div
                key={`row2-${i}`}
                className="w-[380px] shrink-0 p-6 rounded-3xl bg-stone-900/80 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 space-y-4 shadow-xl glass-card-reflection transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-white text-sm font-['Outfit']">{review.name}</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <p className="text-[10px] text-stone-400">{review.role} · {review.city}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "{review.text}"
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-bold">Ordered: {review.dish}</span>
                  <span className="text-stone-500 font-mono">Verified Order</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

