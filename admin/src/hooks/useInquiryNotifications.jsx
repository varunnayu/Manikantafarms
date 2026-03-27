import { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

/**
 * Listens to Firestore inquiries in real-time.
 * On the very first snapshot it records existing IDs (silent baseline).
 * Every subsequent snapshot that has NEW IDs triggers:
 *   1. react-hot-toast banner in the admin UI
 *   2. Browser Push Notification (if permission granted)
 *   3. Returns the list of unread notifications so the bell badge can show them
 */
export function useInquiryNotifications() {
  const knownIds   = useRef(null);   // null = not yet initialised
  const [notifications, setNotifications] = useState([]);  // [{id, name, message, time}]

  /* ── Request browser notification permission on mount ──────── */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  /* ── Firestore real-time listener ──────────────────────────── */
  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snap) => {
      const currentIds = new Set(snap.docs.map(d => d.id));

      /* First load → just record existing IDs, no notifications */
      if (knownIds.current === null) {
        knownIds.current = currentIds;
        return;
      }

      /* Find truly new documents */
      const newDocs = snap.docs.filter(d => !knownIds.current.has(d.id));

      newDocs.forEach(d => {
        const data = d.data();
        const inq = {
          id: d.id,
          name: data.name || 'Someone',
          plantName: data.plantName || '',
          message: data.message || '',
          time: new Date(),
        };

        /* ── In-app toast ─────────────────────────────────────── */
        toast.custom(
          (t) => (
            <div
              onClick={() => toast.dismiss(t.id)}
              className={`flex items-start gap-3 bg-[#1e2329] border border-[#2d6a4f] text-white 
                          px-4 py-3 rounded-2xl shadow-2xl cursor-pointer max-w-sm w-full
                          transition-all ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            >
              <div className="w-9 h-9 rounded-full bg-[#2d6a4f]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">New Inquiry Received!</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  <span className="text-green-400 font-medium">{inq.name}</span>
                  {inq.plantName ? ` · ${inq.plantName}` : ''}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{inq.message}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-1.5 animate-pulse" />
            </div>
          ),
          { duration: 6000, position: 'top-right' }
        );

        /* ── Browser push notification ────────────────────────── */
        if ('Notification' in window && Notification.permission === 'granted') {
          const notif = new Notification('🌿 New Inquiry — GreenSprout Admin', {
            body: `${inq.name}${inq.plantName ? ` is asking about ${inq.plantName}` : ' sent a new inquiry'}`,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: d.id,           // prevents duplicate system notifications
          });
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        }

        /* ── Append to notification list (bell badge) ─────────── */
        setNotifications(prev => [inq, ...prev].slice(0, 20)); // keep last 20
      });

      /* Update known IDs */
      knownIds.current = currentIds;
    });

    return unsub;
  }, []);

  const clearAll = () => setNotifications([]);
  const clearOne = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return { notifications, clearAll, clearOne };
}
