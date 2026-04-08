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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">

        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--cream-dark)] to-[var(--cream)]" />
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--green-main)]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[var(--green-light)]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-10 pb-20">

          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--green-dark)]/5 border border-[var(--green-main)]/10 mb-8 w-max mx-auto lg:mx-0">
              <Leaf className="w-4 h-4 text-[var(--green-main)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green-main)]">Spring Collection 2026</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-[var(--text-dark)] leading-[1.1] mb-6">
              Bring Nature <br className="hidden lg:block" />
              <span className="italic font-light text-[var(--green-main)]">Back Indoors.</span>
            </h1>

            <p className="text-lg text-[var(--text-muted)] mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Curated architectural plants, rare succulents, and lush tropicals designed to elevate your living spaces. Cultivated with care, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/products" className="btn btn-primary text-base px-8 py-3.5 w-full sm:w-auto hover-lift group">
                Shop Collection <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/inquiry" className="btn btn-outline text-base px-8 py-3.5 w-full sm:w-auto hover-lift">
                Contact an Expert
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70">
              <div className="flex items-center gap-2"><Sun className="w-5 h-5 text-[var(--text-muted)]" /> <span className="text-sm font-semibold text-[var(--text-muted)]">Light Needs</span></div>
              <div className="flex items-center gap-2"><Droplets className="w-5 h-5 text-[var(--text-muted)]" /> <span className="text-sm font-semibold text-[var(--text-muted)]">Hydration</span></div>
              <div className="flex items-center gap-2"><Wind className="w-5 h-5 text-[var(--text-muted)]" /> <span className="text-sm font-semibold text-[var(--text-muted)]">Air Purifying</span></div>
            </div>
          </div>

          {/* Hero Imagery - Parallax Effect Container */}
          <div className="relative animate-fade-in delay-200 hidden md:block">
            {/* Floating Abstract Leaf SVG for modern SaaS look, replacing standard image if empty, but we'll use a strong styled box */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--green-dark)] to-[var(--green-light)] rounded-[3rem] rotate-3 animate-float opacity-90 shadow-2xl" />
              <div className="absolute inset-0 bg-[var(--green-main)] rounded-[3rem] -rotate-3 transition-transform duration-700 hover:rotate-0 flex items-center justify-center overflow-hidden border-4 border-white/10 glass-dark">
                <Leaf className="w-48 h-48 text-white/20 animate-float" />
                <div className="absolute bottom-8 left-8 right-8 glass rounded-2xl p-4 flex items-center gap-4 animate-fade-up delay-500 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-dark)] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--text-dark)]">Monstera Deliciosa</p>
                    <p className="text-xs font-semibold text-[var(--green-main)] uppercase tracking-wider">In High Demand</p>
                  </div>
                </div>
              </div>
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
