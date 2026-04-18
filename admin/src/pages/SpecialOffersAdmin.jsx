import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { compressImage, base64SizeKB } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search, Loader2, ImagePlus, Tag, DollarSign, FileText, Image as ImageIcon, PackageSearch } from 'lucide-react';

const CATEGORIES = ['Coffee Beans', 'Coffee Powder', 'Estate Tea', 'Green Tea', 'Herbal Tea'];
const EMPTY_FORM = { name: '', category: '', price: '', description: '', inStock: true, imageUrl: '' };

export default function SpecialOffersAdmin() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [compressing, setCompressing]  = useState(false);
  const [imgSizeKB, setImgSizeKB]   = useState(null);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('All');
  const fileRef = useRef();

  useEffect(() => {
    const q = query(collection(db, 'special_offers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM);
    setImageFile(null); setImagePreview(''); setImgSizeKB(null);
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '', category: p.category || '',
      price: p.price || '', description: p.description || '',
      inStock: p.inStock ?? true, imageUrl: p.imageUrl || '',
    });
    setImageFile(null); setImagePreview(p.imageUrl || '');
    setImgSizeKB(p.imageUrl ? base64SizeKB(p.imageUrl) : null);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false); setEditing(null);
    setImageFile(null); setImagePreview(''); setImgSizeKB(null);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Images only'); return; }

    setCompressing(true);
    setImageFile(file);
    try {
      const base64 = await compressImage(file);
      const kb = base64SizeKB(base64);
      if (kb > 900) {
        toast.error('Image is too large. Choose a smaller file.');
        setImageFile(null); setCompressing(false); return;
      }
      setImagePreview(base64);
      setImgSizeKB(kb);
      setForm(f => ({ ...f, imageUrl: base64 }));
      toast.success(`Image stored (${kb} KB)`);
    } catch {
      toast.error('Failed to compress image');
    } finally {
      setCompressing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name & price required');
    
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(), category: form.category,
        price: parseFloat(form.price), description: form.description.trim(),
        inStock: form.inStock, imageUrl: form.imageUrl || '',
      };
      if (editing) {
        await updateDoc(doc(db, 'special_offers', editing.id), { ...data, updatedAt: serverTimestamp() });
        toast.success('Offer updated');
      } else {
        await addDoc(collection(db, 'special_offers'), { ...data, createdAt: serverTimestamp() });
        toast.success('Offer added');
      }
      closeModal();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    setDeleting(p.id);
    try {
      await deleteDoc(doc(db, 'special_offers', p.id));
      toast.success('Offer deleted');
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const toggleStock = async (p) => {
    try {
      await updateDoc(doc(db, 'special_offers', p.id), { inStock: !p.inStock, updatedAt: serverTimestamp() });
      toast.success(p.inStock ? 'Marked out of stock' : 'Marked in stock');
    } catch {
      toast.error('Update failed');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 opacity-0 animate-[fadeIn_0.4s_ease_forwards]">

      {/* ── Header & Actions ────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-end border-b border-[var(--border)] pb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Estate Reserves (Coffee & Tea)</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage flash sales & reserve items · {products.length} total
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reserves..."
              className="input pl-9 w-full"
            />
          </div>
          <select 
            className="input w-full sm:w-40 appearance-none bg-[var(--bg-app)] border-[var(--border)]"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={openAdd} className="btn btn-primary whitespace-nowrap min-h-[42px]">
            <Plus className="w-4 h-4" /> Add Reserve
          </button>
        </div>
      </div>

      {/* ── Grid Area ──────────────────────────────────── */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-24 flex flex-col items-center justify-center text-zinc-500 text-center border-dashed border-2">
          <PackageSearch className="w-12 h-12 mb-4 opacity-40" />
          <p className="font-semibold text-white">No items found</p>
          <p className="text-sm mt-1 mb-4">You haven't added any coffee or tea items matching this criteria.</p>
          <button onClick={openAdd} className="btn btn-primary">
            Create Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className="card card-lift flex flex-col overflow-hidden relative"
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
            >
              <div className="h-48 bg-zinc-900 border-b border-[var(--border)] relative group">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">☕</div>
                )}
                
                {/* Stock overlay badge directly on image for SaaS flair */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-md 
                                  ${p.inStock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="font-bold text-white text-lg truncate leading-tight">{p.name}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{p.category || 'Uncategorized'}</span>
                    <span className="font-semibold text-white">₹{parseFloat(p.price || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleStock(p)}
                    className="text-xs font-medium text-zinc-400 hover:text-white transition"
                  >
                    Toggle Stock
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="btn btn-secondary !p-2" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deleting === p.id}
                      className="btn btn-danger !p-2"
                      title="Delete"
                    >
                      {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal overlay ────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeModal} />
          
          <div className="card relative w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#111]">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {editing ? 'Edit Reserve' : 'Add New Reserve'}
              </h2>
              <button onClick={closeModal} className="btn-secondary !p-1.5 border-none mt-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-app)]">
              {/* Image Uploader */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                  PRODUCT IMAGE
                  <span className="text-[10px] text-zinc-600 font-normal">Base64</span>
                </label>
                <div
                  onClick={() => !compressing && fileRef.current?.click()}
                  className="relative h-44 border-2 border-dashed border-[var(--border)] rounded-xl overflow-hidden
                             flex items-center justify-center cursor-pointer group bg-zinc-900/30 transition-colors hover:border-zinc-600"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="relative z-10 w-full h-full object-cover" />
                  ) : (
                    <div className="relative z-10 text-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      <ImagePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Click to upload photo</p>
                    </div>
                  )}

                  {compressing && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <p className="text-xs font-medium text-zinc-300">Compressing...</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                
                <div className="flex items-center justify-between mt-2 text-xs">
                  {imgSizeKB && <span className="text-emerald-400 font-medium">Ready: {imgSizeKB}KB</span>}
                  {!imgSizeKB && <span>&nbsp;</span>}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null); setImagePreview(editing?.imageUrl || '');
                        setForm(f => ({...f, imageUrl: editing?.imageUrl || ''}));
                        setImgSizeKB(editing?.imageUrl ? base64SizeKB(editing.imageUrl) : null);
                      }}
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Reset Image
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-2 block">NAME <span className="text-red-400">*</span></label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Premium Arabica Roast" className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 mb-2 block">CATEGORY</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input">
                    <option value="">Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 mb-2 block">PRICE (₹) <span className="text-red-400">*</span></label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="9.99" className="input" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-2 block">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="Brief details..." className="input resize-none py-2" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-zinc-900/50">
                <div>
                  <p className="font-medium text-white text-sm">{form.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  <p className="text-xs text-zinc-500">Status visible to customers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.inStock ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <span className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all shadow-sm ${form.inStock ? 'left-[calc(100%-20px)]' : 'left-1'}`} />
                </button>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] bg-[#111]">
              <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
              <button type="submit" onClick={handleSave} disabled={saving || compressing} className="btn btn-primary min-w-[120px]">
                {saving || compressing ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? 'Save Changes' : 'Create Item')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
