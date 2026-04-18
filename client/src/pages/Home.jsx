import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { Leaf, Truck, ShieldCheck, HeadphonesIcon, ArrowRight, Sun, Droplets, Wind, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'Every plant is hand-selected and inspected for perfect health.' },
  { icon: Truck, title: 'Secure Delivery', desc: 'Carefully packaged to ensure your botanical arrives in pristine condition.' },
  { icon: HeadphonesIcon, title: 'Expert Advice', desc: 'Our horticulturalists are available 7 days a week to assist your journey.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const testimonialsRef = useRef(null);

  // Auto-scroll logic for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (testimonialsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = testimonialsRef.current;
        // If we reached the end, snap back to start. Otherwise scroll right by one card's width approx.
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          testimonialsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testimonialsRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 4500); // swipe every 4.5 seconds
    return () => clearInterval(interval);
  }, []);

  const slideTestimonial = (direction) => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

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
      <SEO
        title="Home"
        description="Welcome to Manikanta Nursery & Farm in Balehalli. Top supplier of coffee plants, arecanut, silver oak, and exotic saplings across India."
      />

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
              We believe successful farming begins with quality plants. Our commitment to excellence ensures healthy, well-established planting material that supports strong growth and dependable field performance.
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

      {/* ── Testimonials & Google Reviews ──────────────────────── */}
      <section className="py-24 bg-white relative z-20 border-t border-[var(--cream-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-fade-up">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-dark)] mb-4">
                Trusted by Farmers Everywhere
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                See what our customers have to say about the quality, survival rate, and yield of our plants.
              </p>
            </div>

            {/* Google Reviews Badge & Arrows */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.google.com/maps/place/manikanta+Nursery+and+farm+Balehalli/@13.218662,75.6909879,1104m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bbb2bbc6e333e13:0xec07356d1851a8f4!8m2!3d13.218662!4d75.6909879!16s%2Fg%2F11fvv8xw74?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--cream)] border border-[var(--cream-dark)] hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                </div>
                <div>
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-dark)] group-hover:text-blue-600 transition-colors">
                    View our Google Reviews
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => slideTestimonial('left')}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--cream)] border border-[var(--cream-dark)] text-[var(--green-main)] hover:bg-[var(--green-main)] hover:text-white transition-all shadow-sm"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => slideTestimonial('right')}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--cream)] border border-[var(--cream-dark)] text-[var(--green-main)] hover:bg-[var(--green-main)] hover:text-white transition-all shadow-sm"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div ref={testimonialsRef} className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { name: "Manoj G A", role: "Verified Customer", rating: 5, text: "Good plant saplings, affordable, good yield. Spices plants are good yielding, good quality and good taste... Owner is very friendly person (Sumit bro)." },
              { name: "Varshini V Gowda", role: "Verified Customer", rating: 5, text: "Best nursery at cheap price.... All the plants that I have taken are in good condition and grown well🪴 Thank you..." },
              { name: "suraksha r gowda", role: "Verified Customer", rating: 5, text: "Healthy plants diease/virus free" },
              { name: "Darshan A C", role: "Verified Customer", rating: 5, text: "Best nursery at affordable price, The plants are very good" },
              { name: "Anil Kumar", role: "Verified Customer", rating: 5, text: "Good nursery, Healthy plants and good transportation service avail here vistit once get better experience." },
              { name: "Pruthvi H K Shetty", role: "Verified Customer", rating: 5, text: "All type of plants are available.. Excellent delivery.." },
            ].map((t, i) => (
              <div key={i} className="w-[85vw] sm:w-[400px] shrink-0 snap-center bg-[var(--cream)] p-8 rounded-3xl border border-[var(--cream-dark)] relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-grab active:cursor-grabbing">
                <Leaf className="absolute top-6 right-6 w-8 h-8 text-[var(--green-main)] opacity-10" />
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-[var(--text-dark)]/80 italic leading-relaxed mb-8">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[var(--green-dark)] text-white flex items-center justify-center font-bold font-serif shadow-md">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-dark)] text-sm">{t.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      {/* <section className="py-24 bg-[var(--green-dark)] border-b-[8px] border-[var(--green-main)] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=1920')] bg-cover bg-center bg-no-repeat" />
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-up relative z-10">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
            Ready to cultivate your plantation?
          </h2>
          <p className="text-lg text-emerald-100/90 mb-10 max-w-2xl mx-auto font-medium">
            Browse our entire collection of hand-picked botanicals, or discover our exclusive Estate Reserves featuring premium Coffee Beans and Estate Teas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn bg-white text-[var(--green-dark)] hover:bg-[var(--cream)] hover:scale-105 shadow-xl px-8 py-4 text-base w-full sm:w-auto font-bold">
              Explore Plants
            </Link>
            <Link to="/special-offers" className="btn bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white px-8 py-4 text-base w-full sm:w-auto font-bold transition-all backdrop-blur-sm">
              Discover Estate Reserves
            </Link>
          </div>
        </div>
      </section> */}

    </div>
  );
}
