import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin, Phone, Globe, MessageCircle, Share2 } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--green-dark)] text-[#FAF9F6] pt-16 pb-8 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.1)] flex items-center justify-center
                            group-hover:rotate-12 transition-transform duration-500">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-serif font-bold text-xl tracking-wide">
                Manikanta
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Cultivating premium indoor and outdoor botanicals. Bringing nature’s finest directly to your doorstep with guaranteed freshness.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Collections</h4>
            <ul className="space-y-4">
              {['Indoor Plants', 'Outdoor Botanicals', 'Rare Succulents', 'Fresh Herbs', 'Bonsai Trees'].map((l) => (
                <li key={l}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              {['Plant Care Guide', 'Shipping & Returns', 'Track Order', 'FAQ', 'Privacy Policy'].map((l) => (
                <li key={l}>
                  <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span>123 Botanical Garden Way<br />Greenville, OR 97001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                <span>support@manikantafarms.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} Manikanta Farms. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
