import React from 'react';
import { Flame, MapPin, Phone, Mail, Clock, Heart, Instagram, Facebook, Twitter, UtensilsCrossed } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 pt-16 pb-12 border-t border-white/10">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Column with Enhanced Logo */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-amber-400 p-0.5 shadow-lg shadow-orange-600/30">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center relative">
                <Flame className="w-5 h-5 text-orange-500 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 font-['Outfit'] font-black text-xl text-white">
                <span>SMASH</span>
                <span className="text-amber-400">&</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">SIZZLE</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-stone-400 block font-mono">
                Artisan Flat-Top Grill
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
            Specializing in high-heat smashed Angus beef burgers, hand-spun velvet milkshakes, and triple-cooked truffle fries delivered piping hot in under 30 minutes.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#instagram" className="w-9 h-9 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-colors border border-white/10">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#facebook" className="w-9 h-9 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-colors border border-white/10">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-9 h-9 bg-white/5 hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-colors border border-white/10">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Menu & Ordering</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setCurrentView('home')} className="hover:text-orange-400 transition-colors cursor-pointer">Home</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('shop')} className="hover:text-orange-400 transition-colors cursor-pointer">Full Kitchen Menu</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('tracking')} className="hover:text-orange-400 transition-colors cursor-pointer">Live Order Status</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('about')} className="hover:text-orange-400 transition-colors cursor-pointer">Our Craft & Story</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('contact')} className="hover:text-orange-400 transition-colors cursor-pointer">Contact Kitchen</button>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setCurrentView('faq')} className="hover:text-orange-400 transition-colors cursor-pointer">FAQ</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('privacy')} className="hover:text-orange-400 transition-colors cursor-pointer">Privacy Statement</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('terms')} className="hover:text-orange-400 transition-colors cursor-pointer">Terms of Service</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('shipping')} className="hover:text-orange-400 transition-colors cursor-pointer">Delivery Boundaries</button>
            </li>
            <li>
              <button onClick={() => setCurrentView('returns')} className="hover:text-orange-400 transition-colors cursor-pointer">Replacement Policy</button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs tracking-wider uppercase">Kitchen Hours</h4>
          <ul className="space-y-3 text-xs text-stone-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>742 Evergreen Terrace, Flavor Town, CA</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>+1 (800) 555-SMASH</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>orders@smashandsizzle.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Open 7 Days · 10am – 2am</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© {new Date().getFullYear()} Smash & Sizzle Co. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for gourmet burger purists.
        </p>
      </div>
    </footer>
  );
};
