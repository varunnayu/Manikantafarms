import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Inquiry from './pages/Inquiry';
import SpecialOffers from './pages/SpecialOffers';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1.2s premium preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1b4332',
          color: '#d1fae5',
          borderRadius: '12px',
          border: '1px solid #2d6a4f',
        }
      }} />

      {/* Premium Preloader Full Overlay */}
      <div className={`fixed inset-0 z-[100] bg-[var(--cream)] flex flex-col items-center justify-center transition-all pointer-events-none ${loading ? 'opacity-100' : 'animate-fade-out'}`}>
        <Leaf className="w-16 h-16 text-[var(--green-main)] animate-bounce mb-4" />
        <h2 className="font-serif text-3xl font-bold tracking-widest text-[var(--green-dark)] animate-pulse">Manikanta</h2>
      </div>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/special-offers" element={<SpecialOffers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
