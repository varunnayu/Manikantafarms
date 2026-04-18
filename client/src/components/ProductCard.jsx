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
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                if(!p.inStock) return;
                const text = `Hello Manikanta Farms! 🌱%0A%0AI am interested in purchasing:%0A*Plant:* ${p.name}%0A*Price:* ₹${price}%0A%0ACan you confirm its availability?`;
                window.open(`https://wa.me/918147109918?text=${text}`, '_blank');
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                          ${p.inStock 
                            ? 'bg-[#25D366] hover:bg-[#1DA851] text-white hover:scale-105 shadow-md' 
                            : 'bg-[var(--cream-dark)] text-[var(--text-muted)] opacity-50 cursor-not-allowed hidden'}`}
              title={p.inStock ? 'Quick WhatsApp' : 'Currently unavailable'}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </button>

            <Link
              to={p.inStock ? `/inquiry?product=${p.id}&name=${encodeURIComponent(p.name)}` : '#'}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 relative z-20
                          ${p.inStock 
                            ? 'bg-[var(--green-dark)] hover:bg-[var(--green-light)] text-white hover:scale-105 shadow-md' 
                            : 'bg-[var(--cream-dark)] text-[var(--text-muted)] opacity-50 cursor-not-allowed'}`}
              title={p.inStock ? 'Email Inquiry' : 'Currently unavailable'}
              onClick={e => !p.inStock && e.preventDefault()}
            >
              <Leaf className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
