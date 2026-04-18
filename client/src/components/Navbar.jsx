import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ShoppingBag } from 'lucide-react';

const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Collection' },
  { path: '/special-offers', label: 'Flash Sale 🔥' },
  { path: '/inquiry', label: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    document.body.style.overflow = !mobileOpen ? 'hidden' : '';
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e8e3d9]
          ${scrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--green-dark)] flex items-center justify-center
                          group-hover:rotate-12 transition-transform duration-500 shadow-md">
              <Leaf className="w-5 h-5 text-[var(--cream)]" strokeWidth={2.5} />
            </div>
            <span className="font-serif font-semibold text-lg sm:text-xl tracking-wide text-[var(--green-dark)] whitespace-nowrap">
              Manikanta Farms
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(l => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) => `
                  relative py-2 text-[0.95rem] font-medium tracking-wide transition-colors duration-300
                  ${isActive ? 'text-[var(--green-dark)]' : 'text-[var(--text-muted)] hover:text-[var(--green-dark)]'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--green-dark)] origin-left transition-transform duration-300
                                    ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Action / Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/products" className="!hidden md:!inline-flex btn btn-primary px-6 py-2">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </Link>

            <button
              onClick={toggleMobile}
              className="md:hidden p-2 rounded-lg text-[var(--green-dark)] hover:bg-[rgba(26,49,34,0.05)] transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500
                      ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleMobile} />

        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[var(--cream)] shadow-2xl
                         flex flex-col pt-24 px-6 gap-6 transition-transform duration-500
                         ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Close button inside drawer */}
          <button
            onClick={toggleMobile}
            className="absolute top-5 right-4 p-2 rounded-lg text-[var(--green-dark)] hover:bg-[rgba(26,49,34,0.05)] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-5">
            {LINKS.map((l, i) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) => `
                  text-2xl font-serif font-medium transition-colors border-b border-[rgba(26,49,34,0.1)] pb-4
                  ${isActive ? 'text-[var(--green-dark)]' : 'text-[var(--text-muted)] hover:text-[var(--green-dark)]'}
                `}
                style={{ transitionDelay: `${i * 50}ms`, transform: mobileOpen ? 'translateX(0)' : 'translateX(20px)', opacity: mobileOpen ? 1 : 0 }}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8" style={{ transitionDelay: '200ms', transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileOpen ? 1 : 0 }}>
            <Link to="/products" className="btn btn-primary w-full py-4 text-base">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
