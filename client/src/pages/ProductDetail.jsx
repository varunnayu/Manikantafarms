import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Leaf, ShieldCheck, Truck, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-32 pb-24 flex justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--green-main)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-32 pb-24 flex flex-col items-center justify-center text-center px-4">
        <Leaf className="w-20 h-20 text-[var(--green-accent)] opacity-50 mb-6" />
        <h1 className="text-4xl font-serif font-bold text-[var(--text-dark)] mb-4">Plant Not Found</h1>
        <p className="text-lg text-[var(--text-muted)] max-w-lg mb-10">We couldn't locate this specific botanical. It may have been removed or relocated.</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary px-10 py-4">
          Browse Collection
        </button>
      </div>
    );
  }

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[var(--cream)] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="py-6 animate-fade-in">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--green-dark)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </button>
        </div>

        {/* Main Product Layout */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[var(--cream-dark)] overflow-hidden flex flex-col lg:flex-row animate-fade-up">

          {/* Left: Large Image Profile */}
          <div className="lg:w-1/2 relative bg-[var(--cream-dark)] min-h-[50vh] lg:min-h-[75vh] flex items-center justify-center p-8 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--cream)] to-[var(--cream-dark)]/50 mix-blend-overlay pointer-events-none" />
            
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain max-h-[600px] drop-shadow-2xl hover-img-scale" 
              />
            ) : (
              <Leaf className="w-32 h-32 text-[var(--green-accent)] opacity-20" />
            )}

            {/* Mobile-only floating stock pill */}
            <div className="lg:hidden absolute top-6 right-6">
              <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-md backdrop-blur-md
                            ${product.inStock ? 'bg-white/90 text-[var(--green-dark)]' : 'bg-red-500/90 text-white'}`}>
                {product.inStock ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Typography */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-[var(--green-dark)]/5 text-[var(--green-main)] text-sm font-bold uppercase tracking-widest rounded-md border border-[var(--green-main)]/10">
                  {product.category || 'Botanical'}
                </span>
                
                {/* Desktop-only static stock pill */}
                <div className="hidden lg:flex items-center gap-2 text-sm font-semibold">
                  {product.inStock ? (
                    <><CheckCircle2 className="w-5 h-5 text-emerald-500"/> <span className="text-emerald-700">Available Now</span></>
                  ) : (
                    <><XCircle className="w-5 h-5 text-red-500"/> <span className="text-red-700">Currently Sold Out</span></>
                  )}
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--text-dark)] leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-[var(--green-dark)]">
                ₹{price}
              </p>
            </div>

            <div className="prose prose-lg text-[var(--text-muted)] mb-12">
              <p className="leading-relaxed whitespace-pre-wrap">
                {product.description || 'This premium botanical specimen has been carefully cultivated to thrive in your space. No detailed description provided yet.'}
              </p>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-[var(--cream-dark)] mt-auto">
              {product.inStock ? (
                <Link
                  to={`/inquiry?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                  className="btn btn-primary w-full sm:w-auto py-4 px-10 text-base"
                >
                  <Leaf className="w-5 h-5 mr-2" /> Inquire to Purchase
                </Link>
              ) : (
                <button disabled className="btn bg-gray-200 text-gray-500 w-full sm:w-auto py-4 px-10 text-base border-none cursor-not-allowed">
                  <XCircle className="w-5 h-5 mr-2" /> Out of Stock
                </button>
              )}
              
              <Link to="/products" className="btn btn-outline w-full sm:w-auto py-4 px-8 text-base bg-white">
                View More Plants
              </Link>
            </div>

            {/* Trust Features below CTA */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-[var(--cream-dark)]">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-[var(--green-main)] shrink-0" />
                <div>
                  <h4 className="font-semibold text-[var(--text-dark)] text-sm mb-1">Guaranteed Quality</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">Hand-selected and inspected for perfect health.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-[var(--green-main)] shrink-0" />
                <div>
                  <h4 className="font-semibold text-[var(--text-dark)] text-sm mb-1">Secure Shipping</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">Packaged meticulously for a safe journey.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
