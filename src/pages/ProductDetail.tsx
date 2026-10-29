import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingBag, ArrowLeft, Check, ShieldCheck, Flame } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailProps {
  productId: string;
  products: Product[];
  onAddToCart: (product: Product, qty: number, options?: Record<string, string>) => void;
  setCurrentView: (view: string, id?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  products,
  onAddToCart,
  setCurrentView,
}) => {
  const product = products.find((p) => p.id === productId) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.choices.length > 0) {
        initial[opt.name] = opt.choices[0].label;
      }
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'ingredients' | 'reviews'>('ingredients');

  if (!product) {
    return (
      <div className="py-20 text-center text-white">
        <p className="text-stone-400">Product not found.</p>
        <button onClick={() => setCurrentView('shop')} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-xl">
          Back to Menu
        </button>
      </div>
    );
  }

  let extraPrice = 0;
  product.options?.forEach((opt) => {
    const selectedChoiceLabel = selectedOptions[opt.name];
    const foundChoice = opt.choices.find((c) => c.label === selectedChoiceLabel);
    if (foundChoice) {
      extraPrice += foundChoice.priceExtra;
    }
  });

  const unitPrice = product.price + extraPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedOptions);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity, selectedOptions);
    setCurrentView('checkout');
  };

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12 text-white">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="flex items-center gap-2 text-stone-400 hover:text-orange-400 font-bold text-xs transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Full Menu
      </button>

      {/* Main Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image Area */}
        <div className="relative aspect-square rounded-[36px] overflow-hidden bg-stone-900 border border-white/15 shadow-2xl glass-card-reflection">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {product.isBestseller && (
            <span className="absolute top-5 left-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 border border-white/20">
              <Flame className="w-4 h-4 fill-current text-amber-300 animate-pulse" /> Sizzle Best
            </span>
          )}
        </div>

        {/* Product Info & Purchase Module */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="text-[11px] font-bold text-stone-300 bg-white/10 border border-white/15 px-3 py-1 rounded-full">
                  {product.subCategory}
                </span>
              )}
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-stone-500 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">{product.name}</h1>
            <p className="text-3xl font-black text-amber-400 mt-2 font-['Outfit']">${unitPrice.toFixed(2)}</p>
          </div>

          <p className="text-stone-300 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Customization Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-stone-400 block">{opt.name}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {opt.choices.map((choice) => {
                      const isSelected = selectedOptions[opt.name] === choice.label;
                      return (
                        <button
                          key={choice.label}
                          type="button"
                          onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: choice.label })}
                          className={`px-4 py-3 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/10'
                              : 'bg-stone-900 border-white/10 text-stone-400 hover:bg-stone-800 hover:text-white'
                          }`}
                        >
                          <span>{choice.label}</span>
                          {choice.priceExtra > 0 && <span className="text-amber-400 font-mono">+${choice.priceExtra.toFixed(2)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase text-stone-400">Quantity</span>
              <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-stone-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-stone-300 hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-stone-300 hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAdd}
                className="py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (${totalPrice.toFixed(2)})</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-4 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-xs text-stone-300">
            <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
            <span>Guaranteed hot and fresh delivery in temperature-sealed packaging.</span>
          </div>
        </div>
      </div>

      {/* Tabs for Ingredients & Reviews */}
      <div className="border-t border-white/10 pt-10">
        <div className="flex gap-4 border-b border-white/10 pb-px">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ingredients' ? 'border-orange-500 text-orange-400' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            Ingredients & Allergens
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'border-orange-500 text-orange-400' : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'ingredients' ? (
            <div className="space-y-4 max-w-2xl text-stone-300 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-white mb-1">Ingredients:</h4>
                <p className="text-stone-400">{product.ingredients}</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Allergen Notice:</h4>
                <p className="text-red-400 font-semibold">{product.allergens}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">Jessica Miller</h5>
                    <div className="flex text-amber-400 gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Yesterday</span>
                </div>
                <p className="text-xs text-stone-300">
                  Absolute perfection! Ordered this last night and it was still warm, crispy, and incredibly flavorful.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/10 pt-12 space-y-8">
          <h3 className="text-2xl font-black text-white font-['Outfit']">You Might Also Crave</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onAddToCart={(p) => onAddToCart(p, 1)}
                onViewDetails={(id) => setCurrentView('product-detail', id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
