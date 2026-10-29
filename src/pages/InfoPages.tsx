import React from 'react';
import { Flame, Mail, Phone, MapPin, Clock, ShieldCheck, HelpCircle, Sparkles, Award, CheckCircle2, ArrowRight, UtensilsCrossed, Heart } from 'lucide-react';

interface InfoPageProps {
  view: string;
  setCurrentView: (view: string) => void;
}

export const InfoPages: React.FC<InfoPageProps> = ({ view, setCurrentView }) => {
  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-10 text-white">
      {/* ABOUT US */}
      {view === 'about' && (
        <div className="space-y-16">
          {/* Header Story */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 bg-orange-500/20 text-orange-400 font-black text-xs uppercase tracking-widest rounded-full border border-orange-500/30">
              The Artisan Grill Story & Heritage
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-['Outfit'] tracking-tight">
              Crafted in Fire. Smashed to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Perfection</span>.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              We started Smash & Sizzle with a burning passion: to resurrect fast food into a culinary art form where fresh Angus beef, screaming hot seasoned steel, and toasted brioche meet.
            </p>
          </div>

          {/* Master Culinary Visual Hero */}
          <div className="relative rounded-[36px] overflow-hidden shadow-2xl border border-white/15 max-w-6xl mx-auto glass-card-reflection aspect-21/9 sm:aspect-21/8">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80"
              alt="Kitchen flat-top grill"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex items-end p-8 sm:p-12">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Seasoned Carbon Steel Flat-Tops
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  "If it doesn't sizzle with a lacy caramelized edge, it doesn't leave our pass."
                </p>
                <p className="text-xs text-stone-300 font-semibold">— Chef Rakesh, Head of Culinary Operations</p>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars of Sizzle Perfection */}
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Our Sacred Kitchen Rules</span>
              <h2 className="text-3xl font-black text-white font-['Outfit'] mt-1">The Anatomy of the Perfect Smash</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="p-7 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/10 space-y-3 glass-card-reflection hover:border-orange-500/40 transition-colors">
                <span className="text-3xl font-black text-orange-400 font-['Outfit']">01.</span>
                <h3 className="font-black text-white text-lg font-['Outfit']">Custom 80/20 Chuck Blend</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  100% pasture-raised Black Angus chuck, brisket, and short rib coarse ground fresh daily. Never frozen, no fillers.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/10 space-y-3 glass-card-reflection hover:border-amber-500/40 transition-colors">
                <span className="text-3xl font-black text-amber-400 font-['Outfit']">02.</span>
                <h3 className="font-black text-white text-lg font-['Outfit']">450°F Iron Smash Press</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Smashed within seconds onto blazing hot flat-tops using heavy weighted iron smashes to force maximum Maillard browning and crispy lace crust.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/10 space-y-3 glass-card-reflection hover:border-red-500/40 transition-colors">
                <span className="text-3xl font-black text-red-400 font-['Outfit']">03.</span>
                <h3 className="font-black text-white text-lg font-['Outfit']">Sweet Cream Brioche</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Baked before dawn by local artisan bakers, buttered with clarified sweet cream butter, and toasted till glossy and cloud-soft.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-stone-900/60 backdrop-blur-xl border border-white/10 space-y-3 glass-card-reflection hover:border-emerald-500/40 transition-colors">
                <span className="text-3xl font-black text-emerald-400 font-['Outfit']">04.</span>
                <h3 className="font-black text-white text-lg font-['Outfit']">Slow-Simmered Sauce</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Our house secret Sizzle glaze is slow-simmered with smoked paprika, roasted shallots, aged cider vinegar, and roasted garlic.
                </p>
              </div>
            </div>
          </div>

          {/* Heritage Timeline 2020 - 2026 */}
          <div className="max-w-6xl mx-auto rounded-[36px] bg-stone-900/50 backdrop-blur-xl border border-white/10 p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Our Journey</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">From Venice Beach Pop-Up to Digital Grill</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
              <div className="space-y-2 border-l-2 border-orange-500/40 pl-4">
                <span className="font-mono text-sm font-black text-orange-400">2020</span>
                <h4 className="font-bold text-white text-base font-['Outfit']">The Food Truck Dream</h4>
                <p className="text-xs text-stone-400 leading-relaxed">Started as a late-night vintage food truck serving 200 smash burgers per night with lines wrapping around the block.</p>
              </div>

              <div className="space-y-2 border-l-2 border-amber-500/40 pl-4">
                <span className="font-mono text-sm font-black text-amber-400">2022</span>
                <h4 className="font-bold text-white text-base font-['Outfit']">First Flagship Kitchen</h4>
                <p className="text-xs text-stone-400 leading-relaxed">Opened our industrial neon-lit dining room equipped with twin chrome flat-tops and custom shake bar.</p>
              </div>

              <div className="space-y-2 border-l-2 border-red-500/40 pl-4">
                <span className="font-mono text-sm font-black text-red-400">2024</span>
                <h4 className="font-bold text-white text-base font-['Outfit']">Voted #1 Smash Burger</h4>
                <p className="text-xs text-stone-400 leading-relaxed">Awarded Best Burger in the West by Food Critic Weekly, expanding into nationwide flash-frozen catering boxes.</p>
              </div>

              <div className="space-y-2 border-l-2 border-emerald-500/40 pl-4">
                <span className="font-mono text-sm font-black text-emerald-400">2026</span>
                <h4 className="font-bold text-white text-base font-['Outfit']">Hyper-Fast Smart Kitchen</h4>
                <p className="text-xs text-stone-400 leading-relaxed">Direct digital ordering with real-time flat-top tracking, 25-minute guarantee, and VIP exclusive drops.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center max-w-xl mx-auto space-y-4 pt-4">
            <h3 className="text-2xl font-black text-white font-['Outfit']">Hungry for the Real Deal?</h3>
            <p className="text-stone-300 text-xs sm:text-sm">Explore our freshly sizzling menu and order right to your doorstep in 30 minutes.</p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl font-black text-xs shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Sizzle Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* CONTACT US */}
      {view === 'contact' && (
        <div className="space-y-10 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 bg-orange-500/20 text-orange-400 font-black text-xs uppercase tracking-widest rounded-full border border-orange-500/30">
              Direct Kitchen Line
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-['Outfit']">Get in Touch With Sizzle HQ</h1>
            <p className="text-stone-300 text-xs sm:text-sm">Inquiries, catering requests, or order assistance—our team is ready 24/7.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="p-8 rounded-3xl bg-stone-900/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-5">
              <h3 className="text-lg font-bold font-['Outfit']">Send a Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Message dispatched! A kitchen concierge will respond promptly."); }} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">Your Name</label>
                  <input type="text" required placeholder="Alex Turner" className="w-full px-4 py-2.5 glass-input rounded-xl" />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">Email Address</label>
                  <input type="email" required placeholder="alex@example.com" className="w-full px-4 py-2.5 glass-input rounded-xl" />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-400 block mb-1">Your Message</label>
                  <textarea rows={4} required placeholder="Catering quote, special order question..." className="w-full px-4 py-2.5 glass-input rounded-xl" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold text-xs shadow-md">
                  Send Message
                </button>
              </form>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border border-white/15 space-y-6">
              <h3 className="text-lg font-bold font-['Outfit']">Flagship Location</h3>
              <ul className="space-y-4 text-xs text-stone-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <span>742 Evergreen Terrace, Flavor Town, CA 90210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-400 shrink-0" />
                  <span>+1 (800) 555-SMASH (24/7 Hotline)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400 shrink-0" />
                  <span>orders@smashandsizzle.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0" />
                  <span>Sunday – Thursday: 10:00 AM – 11:30 PM <br />Friday – Saturday: 10:00 AM – 2:00 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {view === 'faq' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black font-['Outfit']">Frequently Asked Questions</h1>
            <p className="text-stone-400 text-xs">Everything you need to know about our patties, sauces, and deliveries.</p>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base">What is a Smash Burger exactly?</h3>
              <p className="text-xs text-stone-300 leading-relaxed">A smash burger is made by taking a fresh, chilled ball of ground beef and pressing it firmly onto a searing-hot cast-iron flat top. This induces an intense Maillard reaction, forming crispy caramelized edges while locking the meat juices inside.</p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base">How fast will my food arrive?</h3>
              <p className="text-xs text-stone-300 leading-relaxed">Our average dispatch time is 15 minutes, with total delivery reaching your doorstep in 25-35 minutes depending on traffic.</p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
              <h3 className="font-bold text-white text-base">How do promo codes work?</h3>
              <p className="text-xs text-stone-300 leading-relaxed">You can enter discount vouchers (such as SIZZLE30) in your Tray Cart Drawer or directly during checkout to receive automatic savings.</p>
            </div>
          </div>
        </div>
      )}

      {/* LEGAL & POLICIES */}
      {(view === 'privacy' || view === 'terms' || view === 'shipping' || view === 'returns') && (
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-5 text-stone-300 text-xs leading-relaxed">
          <h1 className="text-3xl font-black text-white font-['Outfit'] uppercase">
            {view === 'privacy' ? 'Privacy Policy' : view === 'terms' ? 'Terms of Service' : view === 'shipping' ? 'Shipping & Delivery Policy' : 'Return & Refund Policy'}
          </h1>
          <p className="text-stone-400">Official Smash & Sizzle Policy · Updated October 2026</p>
          <div className="space-y-3 pt-2">
            <p>We respect customer confidentiality and use secure encryption for all orders and transaction logs.</p>
            <p>All fast-food orders are cooked to perfection in sterile commercial dark kitchens complying with full health standards.</p>
            <p>If any order arrives damaged, missing items, or unsatisfactory, our hotline team will instantly replace it free of charge.</p>
          </div>
        </div>
      )}
    </div>
  );
};
