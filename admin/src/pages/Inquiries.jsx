import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Loader2, Mail, Phone, Leaf, Search, Clock, Archive, CheckCircle } from 'lucide-react';

const STATUS_OPTS = [
  { val: 'new',     label: 'New',     icon: Clock,       cls: 'badge-new' },
  { val: 'replied', label: 'Replied', icon: CheckCircle, cls: 'badge-replied' },
  { val: 'closed',  label: 'Closed',  icon: Archive,     cls: 'badge-closed' },
];

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(d);
}

export default function Inquiries() {
  const [inquiries, setInquiries]   = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [search,    setSearch]      = useState('');
  const [filter,    setFilter]      = useState('all');
  const [deleting,  setDeleting]    = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status, updatedAt: serverTimestamp() });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete inquiry from ${name}?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast.success('Inquiry deleted');
    } catch {
      toast.error('Deletion failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = (i.name || '').toLowerCase().includes(search.toLowerCase())
                     || (i.email || '').toLowerCase().includes(search.toLowerCase())
                     || (i.plantName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || (i.status || 'new') === filter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:     inquiries.length,
    new:     inquiries.filter(i => !i.status || i.status === 'new').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    closed:  inquiries.filter(i => i.status === 'closed').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 opacity-0 animate-[fadeIn_0.4s_ease_forwards]">
      
      {/* ── Page Header & Controls ────────────────────────────── */}
      <div className="border-b border-[var(--border)] pb-6 pt-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Inquiries</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review messages and requests · {inquiries.length} total
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Filter Tabs */}
          <div className="flex bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border)] w-full md:w-auto overflow-x-auto">
            {['all', 'new', 'replied', 'closed'].map(val => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap
                  ${filter === val 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full 
                  ${filter === val ? 'bg-zinc-700' : 'bg-zinc-900'}`}>
                  {counts[val]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="input pl-9 w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Inquiries Grid ───────────────────────────────────── */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-24 flex flex-col items-center justify-center text-zinc-500 text-center border-dashed border-2">
          <MessageSquare className="w-12 h-12 mb-4 opacity-40" />
          <p className="font-semibold text-white">No inquiries found</p>
          <p className="text-sm mt-1">Your inbox for this category is completely empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inq, i) => {
            const currentStatus = inq.status || 'new';
            const statConf = STATUS_OPTS.find(s => s.val === currentStatus) || STATUS_OPTS[0];

            return (
              <div
                key={inq.id}
                className="card flex flex-col hover:border-zinc-700 transition-colors"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
              >
                {/* Card Header */}
                <div className="p-5 border-b border-[var(--border)] flex items-start justify-between bg-zinc-900/40 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center flex-shrink-0 border border-zinc-700">
                      {inq.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{inq.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(inq.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${statConf.cls} py-1 px-2.5 shadow-sm`}>
                    {statConf.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Contact Info Row */}
                  <div className="flex flex-col gap-2 mb-4">
                    <a href={`mailto:${inq.email}`} className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 group transition-colors w-max">
                      <Mail className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                      {inq.email}
                    </a>
                    {inq.phone && (
                      <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-600" />
                        {inq.phone}
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-black/40 p-4 rounded-lg border border-zinc-800/50 flex-1">
                    {inq.plantName && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-2 bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                        <Leaf className="w-3 h-3" />
                        Subject: {inq.plantName}
                      </div>
                    )}
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {inq.message || <span className="text-zinc-600 italic">No message content.</span>}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-zinc-900/20 rounded-b-xl">
                  <select 
                    value={currentStatus}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-500 transition cursor-pointer"
                  >
                    {STATUS_OPTS.map(s => (
                      <option key={s.val} value={s.val}>Mark {s.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(inq.id, inq.name)}
                    disabled={deleting === inq.id}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-md transition-colors"
                    title="Delete Inquiry"
                  >
                    {deleting === inq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
