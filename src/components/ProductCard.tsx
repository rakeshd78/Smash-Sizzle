import React from 'react';
import { Star, Plus, Eye, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { HighlightText } from './HighlightText';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (productId: string) => void;
  searchQuery?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  searchQuery = '',
}) => {
  // Check if current card has active search matches
  const queryTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hasSearchMatch =
    queryTerms.length > 0 &&
    queryTerms.some(
      (term) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(term))
    );

  return (
    <div
      className={`bg-stone-900/60 backdrop-blur-xl rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden group glass-card-reflection ${
        hasSearchMatch
          ? 'border-amber-500/60 ring-2 ring-amber-500/30 shadow-2xl shadow-orange-500/20'
          : 'border-white/10 hover:border-orange-500/50 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10'
      }`}
    >
      {/* Product Image Area */}
      <div
        className="relative aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-300 animate-pulse" /> Sizzle Best
            </span>
          )}

          {hasSearchMatch && (
            <span className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 text-stone-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-amber-300/40">
              <Sparkles className="w-3 h-3 fill-stone-950" /> Search Match
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            className="py-2.5 px-5 bg-white/90 backdrop-blur-md text-stone-950 rounded-xl font-bold text-xs hover:bg-white flex items-center justify-center gap-1.5 shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Quick Details
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
                <HighlightText text={product.category} highlight={searchQuery} />
              </span>
              {product.subCategory && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-medium">
                  <HighlightText text={product.subCategory} highlight={searchQuery} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-stone-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name with Highlighting */}
          <h3
            onClick={() => onViewDetails(product.id)}
            className="font-black text-white text-base sm:text-lg cursor-pointer hover:text-orange-400 transition-colors line-clamp-1 font-['Outfit']"
          >
            <HighlightText text={product.name} highlight={searchQuery} />
          </h3>

          {/* Product Description with Highlighting */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mt-1">
            <HighlightText text={product.description} highlight={searchQuery} />
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 block font-bold">Price</span>
            <span className="text-xl font-black text-white font-['Outfit']">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
