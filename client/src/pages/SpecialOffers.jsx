import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { Leaf, ShoppingCart, Coffee, Star, Zap, MapPin, Award } from 'lucide-react';
import SEO from '../components/SEO';

export default function SpecialOffers() {
  const [products, setProducts] = useState([]);
  const WA_NUMBER = "918147109918";

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'special_offers'), limit(12));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleBuyNow = (p, finalPrice) => {
    const text = `Hello Manikanta Farms! ☕🌿%0A%0AI would like to *Buy Now* from your Estate Reserves!%0A%0A*Item:* ${p.name}%0A*Offer Price:* ₹${finalPrice}%0A%0APlease let me know how I can complete the payment.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0C0806] text-[#EAE0D5] selection:bg-[#D4A373] selection:text-[#0C0806] overflow-hidden pt-32 pb-24 relative">
      <SEO 
        title="Estate Reserves & Coffee" 
        description="Exclusive premium coffee beans and estate-grown special reserves directly from Manikanta Farms in Chikmagalur." 
      />

      {/* --- Aesthetic Noise & Grain Overlay --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* --- Dynamic Background Elements --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[#8C5E35]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] -left-10 w-96 h-96 bg-[#6B705C]/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] -right-10 w-80 h-80 bg-[#D4A373]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-[0.15]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {i % 2 === 0 ? <Coffee size={Math.random() * 20 + 10} /> : <Leaf size={Math.random() * 20 + 10} />}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- Premium Header --- */}
        <div className="text-center mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#1C1410] border border-[#D4A373]/20 shadow-xl mb-8 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A373]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A373] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A373]"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4A373]">Limited Reserve Flash Sale</span>
          </div>

          <h3 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-[1] tracking-tight">
            <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-[#D4A373] to-[#8C5E35]">Estate</span> <br />
            Selections
          </h3>

          {/* <div className="flex items-center justify-center gap-6 mb-12">
            {[
              { label: 'Days', val: '02' },
              { label: 'Hrs', val: '14' },
              { label: 'Min', val: '55' },
              { label: 'Sec', val: '32' },
            ].map((t, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl font-bold font-serif text-[#D4A373]">{t.val}</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A98467]">{t.label}</span>
              </div>
            ))}
          </div> */}

          <p className="text-[#A98467] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Experience the art of coffee and tea with our exclusive blends, sourced and crafted for perfection.
          </p>
        </div>

        {/* --- Product Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.length > 0 ? (
            products.map((p, i) => {
              const currentPrice = parseFloat(p.price || 0);
              const originalPrice = (currentPrice * 1.45).toFixed(0);
              const finalPrice = currentPrice.toFixed(0);
              const discount = 30; // Hardcoded aesthetic discount for UI

              return (
                <div
                  key={p.id}
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Card Main Container */}
                  <div className="relative flex flex-col h-full bg-[#0F0A08] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-[#D4A373]/30 group-hover:-translate-y-2 shadow-2xl">

                    {/* Image Section - Compact Height */}
                    <div className="relative h-[240px] overflow-hidden">
                      {/* Interactive Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A08] via-transparent to-black/20 z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        <div className="px-2.5 py-1 bg-[#D4A373] text-[#0C0806] text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                          -{discount}% Off
                        </div>
                        {i === 0 && (
                          <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-medium uppercase tracking-widest border border-white/20 rounded-full">
                            Bestseller
                          </div>
                        )}
                      </div>

                      {/* Origin Badge */}
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 text-white/70 text-[10px] font-medium backdrop-blur-sm px-2.5 py-1 rounded-lg bg-black/20 border border-white/10 group-hover:text-white transition-colors">
                        <MapPin size={10} className="text-[#D4A373]" />
                        <span>Chikkamagaluru, KA</span>
                      </div>

                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1A1411]">
                          <Coffee size={40} className="text-[#3E2B20] animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Content Section - Balanced Padding */}
                    <div className="p-6 pt-5 flex flex-col flex-1 relative">
                      {/* Subtle Glow on Hover */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent group-hover:opacity-100 opacity-0 transition-opacity" />

                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-serif text-xl font-bold group-hover:text-[#D4A373] transition-colors leading-tight line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[#D4A373] shrink-0">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-bold">4.9</span>
                        </div>
                      </div>

                      <p className="text-[#A98467] text-xs leading-relaxed mb-6 line-clamp-2 font-light">
                        Experience the rich aroma of hand-picked beans, roasted to perfection in small batches to preserve natural oils.
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-white tracking-tight">₹{finalPrice}</span>
                          <span className="text-xs text-[#A98467]/50 line-through">₹{originalPrice}</span>
                        </div>

                        <button
                          onClick={() => p.inStock && handleBuyNow(p, finalPrice)}
                          disabled={!p.inStock}
                          className={`group/btn relative w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-500 overflow-hidden
                            ${p.inStock
                              ? 'bg-white text-[#0C0806] hover:bg-[#D4A373] active:scale-[0.98]'
                              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
                        >
                          {p.inStock ? (
                            <>
                              <Zap size={16} className="transition-transform group-hover/btn:scale-125" />
                              <span className="uppercase tracking-widest text-[11px]">Instant Purchase</span>

                              {/* Glowing Inner Effect */}
                              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none bg-gradient-to-tr from-[#D4A373]/20 via-transparent to-white/30" />
                            </>
                          ) : 'Sold Out'}
                        </button>

                        <div className="flex items-center justify-center gap-3 mt-5 opacity-40 group-hover:opacity-70 transition-opacity">
                          <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold">
                            <Award size={9} />
                            <span>Premium</span>
                          </div>
                          <div className="w-0.5 h-0.5 rounded-full bg-[#D4A373]" />
                          <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold">
                            <Zap size={9} />
                            <span>Express</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-[2rem] border border-[#D4A373]/0 group-hover:border-[#D4A373]/10 pointer-events-none transition-all duration-500" />
                  </div>
                </div>
              );
            })
          ) : (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[420px] rounded-[2rem] bg-[#0F0A08] border border-white/5 animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))
          )}
        </div>

        {/* --- Trust Disclaimer --- */}
        <div className="mt-32 text-center animate-fade-up">
          <p className="text-[#A98467]/50 text-xs uppercase tracking-[0.4em] mb-4">Authentic Farm Selections</p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent mx-auto" />
        </div>

      </div>
    </div>
  );
}
