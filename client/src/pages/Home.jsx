import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Leaf, Truck, ShieldCheck, HeadphonesIcon, ArrowRight, Sun, Droplets, Wind } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'Every plant is hand-selected and inspected for perfect health.' },
  { icon: Truck, title: 'Secure Delivery', desc: 'Carefully packaged to ensure your botanical arrives in pristine condition.' },
  { icon: HeadphonesIcon, title: 'Expert Advice', desc: 'Our horticulturalists are available 7 days a week to assist your journey.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
    const unsub = onSnapshot(q, snap => {
      setFeatured(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Premium Hero Section ───────────────────────────── */}
      <section
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?q=80&w=1920&auto=format&fit=crop")' }}
      >
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[var(--cream)]/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10 pb-20">

          <div className="text-center md:text-left max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 w-max mx-auto md:mx-0 shadow-lg">
              <Leaf className="w-4 h-4 text-[var(--green-light)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Spring Collection 2026</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.15] mb-6 drop-shadow-lg">
              Quality Plants for <br className="hidden md:block" />
              <span className="italic font-light text-[var(--green-light)]">Successful Farms.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium drop-shadow-md">
              We supply a professionally selected range of fruit plants, spice crops, and commercial plantation varieties. Healthy, field-ready plants raised with care to ensure strong establishment, high survival, and reliable performance for productive farming.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link to="/products" className="btn bg-[var(--green-main)] text-white hover:bg-[var(--green-dark)] shadow-xl text-base px-8 py-4 w-full sm:w-auto transition-transform hover:scale-105 group">
                Shop Collection <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/inquiry" className="btn bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 text-base px-8 py-4 w-full sm:w-auto transition-colors">
                Contact an Expert
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-10 opacity-90">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"><Sun className="w-5 h-5 text-[var(--green-light)]" /> <span className="text-sm font-semibold text-white tracking-wide">High Survival</span></div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"><Droplets className="w-5 h-5 text-[var(--green-light)]" /> <span className="text-sm font-semibold text-white tracking-wide">Field Ready</span></div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"><ShieldCheck className="w-5 h-5 text-[var(--green-light)]" /> <span className="text-sm font-semibold text-white tracking-wide">Productive Yields</span></div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Features Section ────────────────────────────────── */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-dark)] mb-4">
              The Manikanta Standard
            </h2>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              We believe a home isn't complete without a touch of living nature. Our commitment to excellence ensures your botanical thrives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center p-8 rounded-3xl bg-[var(--cream)] border border-[var(--cream-dark)]
                            hover-lift animate-fade-up delay-${Math.min(i * 100, 300)}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[var(--cream-dark)] flex items-center justify-center mb-6 text-[var(--green-main)]">
                  <f.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-dark)] mb-3">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Carousel/Grid ───────────────────── */}
      <section className="py-24 bg-[var(--cream)] border-t border-[var(--cream-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-up">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-dark)] mb-3">
                Featured Arrivals
              </h2>
              <p className="text-[var(--text-muted)] text-lg">Freshly rooted and ready for their new home.</p>
            </div>
            <Link to="/products" className="btn btn-outline hover-lift flex-shrink-0">
              View All Plants <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {featured.length > 0 ? (
              featured.map((p, i) => (
                <ProductCard key={p.id} p={p} delay={`delay-${Math.min((i + 1) * 100, 400)}`} />
              ))
            ) : (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className={`h-[400px] rounded-2xl bg-[var(--cream-dark)] animate-pulse delay-${n * 100}`} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      {/* <section className="py-24 bg-[var(--green-dark)] border-b-[8px] border-[var(--green-main)]">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-up">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Ready to cultivate your personal oasis?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Browse our entire collection of hand-picked botanicals, curated specifically for modern living spaces and experienced collectors alike.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn bg-white text-[var(--green-dark)] hover:bg-[var(--cream-dark)] hover:scale-105 shadow-xl px-8 py-3.5 text-base w-full sm:w-auto">
              Explore Store
            </Link>
          </div>
        </div>
      </section> */}

    </div>
  );
}
