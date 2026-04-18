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
                Manikanta Nursery & Farms
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              <strong className="text-white block mb-2 font-serif tracking-wide"></strong>
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="https://www.google.com/maps/place/manikanta+Nursery+and+farm+Balehalli/@13.218662,75.6909879,1104m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bbb2bbc6e333e13:0xec07356d1851a8f4!8m2!3d13.218662!4d75.6909879!16s%2Fg%2F11fvv8xw74?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="https://wa.me/918147109918" className="hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Collections</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Plant Inventory
                </Link>
              </li>
              <li>
                <Link to="/special-offers" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Estate Reserves (Coffee & Tea)
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Commercial Crops
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/inquiry" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/inquiry" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Bulk Ordering
                </Link>
              </li>
              <li>
                <a href="https://wa.me/918147109918" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noreferrer">
                  WhatsApp Help
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span>Manikanta nursery and farm balehalli<br />Balehalli, chikkamagalur 577111<br />Karnataka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                <span>8147109918</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <a href="mailto:manikantanurserybalehalli@gmail.com" className="hover:text-white transition-colors break-all">manikantanurserybalehalli@gmail.com</a>
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
            {/* <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a> */}
          </div>
        </div>

      </div>
    </footer>
  );
}
