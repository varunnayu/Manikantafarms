import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export default function ProductCard({ p, delay }) {
  const price = typeof p.price === 'number' ? p.price.toFixed(2) : parseFloat(p.price || 0).toFixed(2);
  
  return (
    <div 
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden hover-lift
                  border border-[rgba(26,49,34,0.08)] animate-fade-up ${delay}`}
    >
      {/* Image Area */}
      <Link to={`/products/${p.id}`} className="block relative h-64 overflow-hidden bg-[var(--cream-dark)] hover-img-scale">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-[var(--green-accent)] opacity-20" />
          </div>
        )}
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Stock Badge */}
        <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:-translate-y-1">
          <span className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md
                            ${p.inStock 
                              ? 'bg-[var(--cream)]/90 text-[var(--green-dark)]' 
                              : 'bg-red-500/90 text-white'}`}
          >
            {p.inStock ? 'Available' : 'Sold Out'}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 bg-white relative">
        <div className="flex justify-between items-start gap-3 flex-1 mb-8">
          <div>
            <h3 className="font-serif font-bold text-xl text-[var(--text-dark)] leading-tight mb-2 group-hover:text-[var(--green-main)] transition-colors">
              <Link to={`/products/${p.id}`} className="before:absolute before:inset-0">
                {p.name}
              </Link>
            </h3>
            <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              {p.category || 'Botanical'}
            </span>
          </div>
          <span className="text-lg font-bold text-[var(--green-dark)] ml-auto">
            ₹{price}
          </span>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--cream-dark)] relative z-20">
          <Link 
            to={`/products/${p.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--green-main)] group/link"
          >
            <span className="group-hover/link:underline underline-offset-4 decoration-2">Discover</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
          
          <Link
            to={p.inStock ? `/inquiry?product=${p.id}&name=${encodeURIComponent(p.name)}` : '#'}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                        ${p.inStock 
                          ? 'bg-[var(--green-dark)] hover:bg-[var(--green-light)] text-white hover:scale-105 shadow-md' 
                          : 'bg-[var(--cream-dark)] text-[var(--text-muted)] opacity-50 cursor-not-allowed'}`}
            title={p.inStock ? 'Inquire now' : 'Currently unavailable'}
            onClick={e => !p.inStock && e.preventDefault()}
          >
            <Leaf className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
