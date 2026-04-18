import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PackageSearch, MessageSquare, TrendingUp, CheckCircle, Leaf, ArrowRight, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Status badge helper ──────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    new:     'badge badge-new',
    replied: 'badge badge-replied',
    closed:  'badge badge-closed',
  };
  return (
    <span className={map[status] || map.new}>
      {(status || 'new').charAt(0).toUpperCase() + (status || 'new').slice(1)}
    </span>
  );
}

/* ── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, delay }) {
  return (
    <div className={`card card-lift p-6 flex flex-col justify-between h-32 animate-slide-up ${delay}`}>
      <div className="flex items-center justify-between text-zinc-400">
        <p className="font-medium text-sm tracking-wide">{label}</p>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-white">
          {value !== null ? value : <span className="inline-block w-12 h-8 bg-zinc-800 rounded animate-pulse" />}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user }                          = useAuth();
  const [products,  setProducts]          = useState([]);
  const [offers,    setOffers]            = useState([]);
  const [inquiries, setInquiries]         = useState([]);
  const [loading,   setLoading]           = useState(true);

  useEffect(() => {
    let loadedP = false, loadedO = false, loadedI = false;
    const checkBgLoaded = () => { if (loadedP && loadedO && loadedI) setLoading(false); };

    const unsubP = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      loadedP = true; checkBgLoaded();
    });
    const unsubO = onSnapshot(collection(db, 'special_offers'), snap => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      loadedO = true; checkBgLoaded();
    });
    const unsubI = onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')),
      snap => {
        setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        loadedI = true; checkBgLoaded();
      }
    );
    return () => { unsubP(); unsubO(); unsubI(); };
  }, []);

  const outStockCount = loading ? null : products.filter(p => !p.inStock).length + offers.filter(o => !o.inStock).length;
  const newInquiries = loading ? null : inquiries.filter(i => !i.status || i.status === 'new').length;
  const recent       = inquiries.slice(0, 4);

  const stats = [
    { label: 'Plant Inventory', value: loading ? null : products.length, icon: PackageSearch, delay: '' },
    { label: 'Estate Reserves', value: loading ? null : offers.length, icon: CheckCircle, delay: 'delay-100' },
    { label: 'Out of Stock', value: outStockCount, icon: TrendingUp, delay: 'delay-200' },
    { label: 'Unread Inquiries', value: newInquiries, icon: MessageSquare, delay: 'delay-300' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12 opacity-0 animate-[fadeIn_0.4s_ease_forwards]">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="border-b border-[var(--border)] pb-8 pt-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {greeting}, {user?.email?.split('@')[0] || 'Admin'}
        </h1>
        <p className="text-zinc-400 mt-1.5 flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-emerald-500" />
          Here's your nursery overview.
        </p>
      </div>

      {/* ── Stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Recent Inquiries Grid ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white tracking-tight">Recent Inquiries</h2>
          <Link to="/inquiries" className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="card p-5 h-32 animate-pulse bg-zinc-900/50" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-zinc-500 text-center border-dashed">
            <MessageSquare className="w-8 h-8 opacity-40 mb-3" />
            <p className="font-medium">No inquiries received yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {recent.map((inq, i) => (
              <div
                key={inq.id}
                className="card p-5 hover:bg-[var(--bg-surface-hover)] transition-colors cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                      {inq.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{inq.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{inq.email}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <StatusBadge status={inq.status || 'new'} />
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 border border-[var(--border)] mt-auto">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {inq.message || <span className="text-zinc-500 italic">No message provided</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
