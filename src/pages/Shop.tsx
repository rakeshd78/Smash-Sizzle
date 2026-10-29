import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Flame, ChevronDown, ChevronRight, X, DollarSign, Filter, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (product: Product) => void;
  setCurrentView: (view: string, id?: string) => void;
}

export const Shop: React.FC<ShopProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  setCurrentView,
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under-8', '8-12', 'above-12'
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Categories and their sub-categories structure
  const categoryStructure: Record<string, { label: string; icon: string; subCategories: string[] }> = {
    Burgers: {
      label: 'Burgers',
      icon: '🍔',
      subCategories: ['Single Smash', 'Double & Triple Beast', 'Truffle & Bacon Specials'],
    },
    Beverages: {
      label: 'Cold Drinks & Shakes',
      icon: '🥤',
      subCategories: ['Hand-Spun Milkshakes', 'Iced Sodas & Chillers'],
    },
    'French Fries': {
      label: 'French Fries & Sides',
      icon: '🍟',
      subCategories: ['Truffle & Loaded', 'Onion Rings & Dips'],
    },
    Chicken: {
      label: 'Chicken & Wings',
      icon: '🍗',
      subCategories: ['Fried Hot Chicken', 'Spicy Wings'],
    },
    Pizzas: {
      label: 'Artisan Pizzas',
      icon: '🍕',
      subCategories: ['Sourdough Artisan', 'Spicy & Pepperoni'],
    },
    Sandwiches: {
      label: 'Sandwiches',
      icon: '🥪',
      subCategories: ['BBQ & Pulled Meats'],
    },
    Wraps: {
      label: 'Fresh Wraps',
      icon: '🌯',
      subCategories: ['Grilled & Crispy Wraps'],
    },
    Desserts: {
      label: 'Desserts & Sweets',
      icon: '🍰',
      subCategories: ['Lava Cakes & Sweets'],
    },
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

        // Subcategory check
        const matchesSubCategory =
          selectedSubCategory === 'All' ||
          p.subCategory === selectedSubCategory ||
          (!p.subCategory && selectedSubCategory === 'All');

        // Price check
        let matchesPrice = true;
        if (priceRange === 'under-8') matchesPrice = p.price < 8;
        if (priceRange === '8-12') matchesPrice = p.price >= 8 && p.price <= 12;
        if (priceRange === 'above-12') matchesPrice = p.price > 12;

        // Rating check
        const matchesRating = p.rating >= minRating;

        // Search check
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSubCategory && matchesPrice && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubCategory, priceRange, minRating, searchQuery, sortBy]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('All');
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setPriceRange('all');
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-8 text-white">
      {/* Top Breadcrumb & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-500">
            {selectedCategory === 'All' ? 'Full Gourmet Kitchen' : selectedCategory}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] mt-1">
            Menu Catalog
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Browse our smash burgers, crispy chicken, and cold drinks with live subcategory filtering.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2.5 bg-stone-900 border border-white/15 rounded-xl text-xs font-bold text-orange-400 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2 bg-stone-900/90 border border-white/15 rounded-2xl px-4 py-2.5 shadow-md">
            <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-stone-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-stone-900">Featured & Popular</option>
              <option value="price-low" className="bg-stone-900">Price: Low to High</option>
              <option value="price-high" className="bg-stone-900">Price: High to Low</option>
              <option value="rating" className="bg-stone-900">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (3 Cols) + Right Products Grid (9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: Categories, Sub-Categories, Prices */}
        <aside
          className={`lg:col-span-3 xl:col-span-3 bg-stone-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-7 sticky top-28 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header & Reset */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-extrabold text-base font-['Outfit']">
              <Filter className="w-4 h-4 text-orange-400" />
              <span>Menu Filters</span>
            </div>
            <button
              onClick={resetAllFilters}
              className="text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Search Box in Sidebar */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Search Food
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search smash, fries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 glass-input rounded-xl text-xs placeholder-stone-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <div className="flex items-center justify-between text-[10px] pt-1.5 px-1 font-bold">
                <span className="text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-amber-400" /> {filteredProducts.length} matched
                </span>
                <span className="text-stone-500 font-mono">Highlight Active</span>
              </div>
            )}
          </div>

          {/* CATEGORIES & SUB-CATEGORIES ACCORDION */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-orange-400 block">
              Categories & Subcategories
            </label>

            {/* "All Items" Option */}
            <button
              onClick={() => handleSelectCategory('All')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300'
              }`}
            >
              <span>🔥 All Menu Items</span>
              <span className="text-[10px] opacity-80">{products.length}</span>
            </button>

            {/* Individual Categories with Expandable Subcategories */}
            <div className="space-y-1.5 pt-1">
              {Object.entries(categoryStructure).map(([catKey, catData]) => {
                const isSelected = selectedCategory === catKey;
                const catProductCount = products.filter((p) => p.category === catKey).length;

                return (
                  <div key={catKey} className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                    {/* Category Parent Button */}
                    <button
                      onClick={() => handleSelectCategory(catKey)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-400 border-l-4 border-orange-500'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{catData.icon}</span>
                        <span>{catData.label}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stone-500 font-mono">({catProductCount})</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Subcategories (Shown when this category is active) */}
                    {isSelected && (
                      <div className="p-2 space-y-1 bg-black/40 border-t border-white/5">
                        <button
                          onClick={() => setSelectedSubCategory('All')}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                            selectedSubCategory === 'All'
                              ? 'bg-orange-600/30 text-amber-300 font-black'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          <span>• All {catData.label}</span>
                          <span className="text-[10px]">{catProductCount}</span>
                        </button>
                        {catData.subCategories.map((sub) => {
                          const isSubSelected = selectedSubCategory === sub;
                          const subCount = products.filter((p) => p.subCategory === sub).length;
                          return (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubCategory(sub)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isSubSelected
                                  ? 'bg-orange-600/30 text-amber-300 font-black'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              <span>↳ {sub}</span>
                              <span className="text-[10px] text-stone-500 font-mono">({subCount})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRICE RANGE FILTER */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-[11px] font-black uppercase tracking-wider text-orange-400 block">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'All Prices', val: 'all' },
                { label: 'Under $8', val: 'under-8' },
                { label: '$8 – $12', val: '8-12' },
                { label: 'Above $12', val: 'above-12' },
              ].map((tier) => (
                <button
                  key={tier.val}
                  onClick={() => setPriceRange(tier.val)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-extrabold border text-center transition-all cursor-pointer ${
                    priceRange === tier.val
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-md'
                      : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* RATING FILTER */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-[11px] font-black uppercase tracking-wider text-orange-400 block">
              Customer Rating
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMinRating(0)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${minRating === 0 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-white/5 border-white/10 text-stone-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setMinRating(4.7)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${minRating === 4.7 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-white/5 border-white/10 text-stone-400'}`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-current" /> 4.7+
              </button>
              <button
                onClick={() => setMinRating(4.9)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 ${minRating === 4.9 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-white/5 border-white/10 text-stone-400'}`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-current" /> 4.9+
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA: Products Showcase (9 Cols) */}
        <main className="lg:col-span-9 xl:col-span-9 space-y-6">
          {/* SEARCH RESULTS HIGHLIGHT BANNER */}
          {searchQuery.trim().length > 0 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-stone-900/90 to-amber-950/40 border border-amber-500/40 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card-reflection">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    Live Search & Visual Term Highlighting
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2 flex-wrap">
                  <span>Results for:</span>
                  <span className="px-3 py-0.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-base sm:text-lg">
                    "{searchQuery}"
                  </span>
                </h2>
                <p className="text-xs text-stone-300">
                  Showing <strong className="text-amber-300 font-bold">{filteredProducts.length}</strong> matching {filteredProducts.length === 1 ? 'item' : 'items'}. Matching search terms in product names and descriptions are emphasized with glowing gold highlights.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Highlight Active
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-900/40 p-4 rounded-2xl border border-white/10 text-xs">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Active Filters:</span>
            {searchQuery.trim() && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold flex items-center gap-1.5 shadow-sm shadow-amber-500/20">
                <Sparkles className="w-3 h-3 fill-amber-300" />
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-white ml-0.5 cursor-pointer"
                  title="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <span className="px-3 py-1 bg-orange-600/20 text-orange-300 border border-orange-500/30 rounded-full font-bold">
              Category: {selectedCategory}
            </span>
            {selectedSubCategory !== 'All' && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-bold">
                Subcategory: {selectedSubCategory}
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="px-3 py-1 bg-white/10 text-stone-200 border border-white/20 rounded-full font-bold">
                Price: {priceRange}
              </span>
            )}
            <span className="ml-auto text-stone-400 font-mono text-[11px]">
              Showing <strong className="text-white">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-6 bg-stone-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🔍
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  {searchQuery.trim()
                    ? `No items found matching "${searchQuery}"`
                    : 'No items matched your filters'}
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  {searchQuery.trim()
                    ? 'Try checking for typos or click one of our popular fast-food keywords below:'
                    : 'Try selecting a different subcategory or widening the price range.'}
                </p>
              </div>

              {searchQuery.trim() && (
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto pt-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block w-full mb-1">
                    Quick Suggestions:
                  </span>
                  {['Smash', 'Burger', 'Truffle', 'Fries', 'Shake', 'Chicken', 'Bacon', 'Cheese'].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-orange-600/20 text-stone-300 hover:text-orange-300 border border-white/10 hover:border-orange-500/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:from-orange-500 hover:to-red-500 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  searchQuery={searchQuery}
                  onAddToCart={onAddToCart}
                  onViewDetails={(id) => setCurrentView('product-detail', id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
