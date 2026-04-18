import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { Leaf, Send, Loader2, Mail, Phone, User, MessageSquare } from 'lucide-react';

export default function Inquiry() {
  const [params] = useSearchParams();
  const prodId = params.get('product') || '';
  const prodName = params.get('name') || '';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', plantName: prodName, message: '', botField: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Anti-bot Honeypot Check
    if (form.botField) {
      toast.success('Inquiry sent successfully!'); // silently fail bots
      setForm({ name: '', email: '', phone: '', plantName: '', message: '', botField: '' });
      return;
    }

    // Client-side Rate Limit (Stop rapid-fire requests)
    const lastSent = localStorage.getItem('lastInquiryTime');
    if (lastSent && Date.now() - parseInt(lastSent) < 60000 * 5) { // 5 Minute cooldown
      toast.error('Please wait a few minutes before sending another inquiry.');
      return;
    }

    setLoading(true);
    try {
      const inquiryData = {
        name: form.name.trim(),
        email: form.email.trim() || 'not-provided@example.com',
        phone: form.phone.trim(),
        plantName: form.plantName.trim(),
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp()
      };

      // 1. Save to Firestore (Admin Dashboard)
      await addDoc(collection(db, 'inquiries'), inquiryData);

      // 2. Forward to Email (EmailJS)
      const EMAILJS_SERVICE_ID = "service_dar7bi8";
      const EMAILJS_TEMPLATE_ID = "template_ufnmnbn";
      const EMAILJS_PUBLIC_KEY = "kPg540CltyHJT3EWK";

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: inquiryData.name,
            from_email: inquiryData.email,
            phone: inquiryData.phone,
            plant_name: inquiryData.plantName,
            message: inquiryData.message,
            to_email: 'varunacc2@gmail.com'
          }
        })
      });

      localStorage.setItem('lastInquiryTime', Date.now().toString());
      toast.success('Inquiry sent successfully!');
      setForm({ name: '', email: '', phone: '', plantName: '', message: '', botField: '' });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error('Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[var(--cream)]">
      <SEO 
        title="Contact & Inquiry" 
        description="Get in touch with Manikanta Nursery & Farm. Direct WhatsApp support or email inquiry for bulk planting orders in Chikmagalur." 
      />

      {/* ── Immersive Background Overlay ───────────────────────── */}
      <div className="absolute top-[80px] left-0 right-0 bottom-0 z-0 select-none pointer-events-none">

        {/* Responsive Logo Background */}
        <img
          src="/Rustic Logo for Manikanta Farms (1).png"
          alt="Manikanta Farms Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-5 gap-12 items-center">

        {/* ── Left Content (Text) ───────────────────────── */}
        <div className="lg:col-span-2 text-center lg:text-left text-[var(--text-dark)] animate-fade-in delay-100">
        </div>

        {/* ── Right Content (Glass Card Form) ───────────────────────── */}
        <div className="lg:col-span-3 lg:pl-10 animate-fade-up">
          <div className="glass p-8 sm:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden border border-[var(--cream-dark)]">

            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--green-light)]/10 blur-2xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--green-main)]/10 blur-2xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold text-[var(--text-dark)] mb-2">Request Consultation</h2>
              <p className="text-sm text-[var(--text-muted)] mb-8 font-medium">
                Fill out the form below. We aim to respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none z-10" />
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Full Name *"
                      className="input-premium !pl-12 bg-white/95 focus:bg-white text-gray-900 border-none shadow-inner"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none z-10" />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone Number *"
                      className="input-premium !pl-12 bg-white/95 focus:bg-white text-gray-900 border-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Anti-spam Honeypot Field (Hidden from real users) */}
                <div style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="botField"
                    value={form.botField}
                    onChange={e => setForm(f => ({ ...f, botField: e.target.value }))}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none z-10" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email Address"
                    className="input-premium !pl-12 bg-white/95 focus:bg-white text-gray-900 border-none shadow-inner"
                  />
                </div>


                {/* Plant Name (Autofilled if navigated from products) */}
                <div className="relative">
                  <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none z-10" />
                  <input
                    value={form.plantName}
                    onChange={e => setForm(f => ({ ...f, plantName: e.target.value }))}
                    placeholder={prodName ? `Inquiring about: ${prodName}` : "Specific Plant or Category? (Optional)"}
                    className="input-premium !pl-12 bg-white/95 focus:bg-white text-gray-900 border-none shadow-inner font-medium"
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help you? *"
                    className="input-premium py-4 bg-white/95 focus:bg-white text-gray-900 border-none shadow-inner resize-none block"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn bg-[var(--cream)] text-[var(--green-main)] hover:bg-[var(--cream-dark)] hover:scale-[1.02] shadow-xl w-full py-4 text-base font-bold mt-4"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--green-main)]" /> : (
                    <><Send className="w-5 h-5 mr-2" /> Submit Inquiry</>
                  )}
                </button>

              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
