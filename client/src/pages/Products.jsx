import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import { Search, Loader2, Tag, FilterX } from 'lucide-react';

const CATEGORIES = ['All', 'Indoor', 'Flowers', 'Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[var(--cream)] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--text-dark)] mb-6">
            The Botanical Collection
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            Discover our meticulously curated selection of indoor and outdoor specimens. Filter by category or search directly for your next perfect addition.
          </p>
        </div>

        {/* Filters & Navigation Control */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[var(--cream-dark)] mb-12 relative z-20 animate-fade-up delay-100">
          <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">

            {/* Horizontal scrollable categories */}
            <div className="flex w-full lg:w-auto overflow-x-auto gap-2 pb-2 lg:pb-0 scroll-x items-center">
              <div className="flex-shrink-0 mr-2 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--cream-dark)]">
                <Tag className="w-4 h-4 text-[var(--green-main)]" />
              </div>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCat(c)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0
                              ${filterCat === c
                      ? 'bg-[var(--green-dark)] text-white shadow-md'
                      : 'bg-[var(--cream)] text-[var(--text-muted)] hover:bg-[var(--cream-dark)] hover:text-[var(--text-dark)]'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Premium Search Input */}
            <div className="relative w-full lg:w-80 flex-shrink-0 glass-dark rounded-xl overflow-hidden p-[1px]">
              <div className="bg-white rounded-xl relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[var(--text-muted)] opacity-50" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search over 500+ plants..."
                  className="w-full py-3.5 pl-12 pr-4 bg-transparent text-[var(--text-dark)] font-medium outline-none placeholder:font-normal placeholder:opacity-60"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-[var(--green-main)] animate-spin" />
            <p className="font-medium text-[var(--text-muted)] tracking-widest uppercase text-sm">Harvesting Catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-[var(--cream-dark)] shadow-sm animate-fade-in">
            <FilterX className="w-16 h-16 text-[var(--green-accent)] opacity-40 mb-6" />
            <h3 className="text-2xl font-serif font-bold text-[var(--text-dark)] mb-3">No matching botanicals</h3>
            <p className="text-[var(--text-muted)] max-w-sm mb-8">We couldn't find any plants matching your current search parameters or category filter.</p>
            <button
              onClick={() => { setSearch(''); setFilterCat('All'); }}
              className="btn btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={`delay-${Math.min((i % 12) * 50, 600)}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
