import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, PackageSearch, MessageSquare,
  LogOut, Leaf, Menu, X, ChevronRight,
  Bell, BellRing, Trash2, ExternalLink, Moon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useInquiryNotifications } from '../hooks/useInquiryNotifications.jsx';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Overview',  end: true },
  { to: '/products',  icon: PackageSearch,   label: 'Products',            },
  { to: '/inquiries', icon: MessageSquare,   label: 'Inquiries',           },
];

function relTime(date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/* ── Sidebar nav item ──────────────────────────────────────── */
function SideNavItem({ to, icon: Icon, label, end, badge, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center justify-between px-3 py-2.5 rounded-lg
         text-sm font-medium transition-all duration-200 relative mb-1
         ${isActive
           ? 'bg-zinc-800/80 text-white shadow-sm ring-1 ring-zinc-700/50'
           : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
         }`
      }
    >
      {({ isActive }) => (
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors
                           ${isActive ? 'text-white' : 'group-hover:text-zinc-300'}`}
          />
          {!collapsed && (
            <span className="truncate tracking-wide">{label}</span>
          )}
        </div>
      )}
    </NavLink>
  );
}

/* ── Sidebar content ───────────────────────────────────────── */
function SidebarContent({ collapsed, onClose, user, onLogout, unreadCount }) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-nav)]">

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700">
          <Leaf className="w-4 h-4 text-emerald-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm tracking-tight text-white leading-none">Manikanta Farms</p>
            <p className="text-[11px] font-medium text-emerald-500 mt-1 uppercase tracking-widest">Admin</p>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 pb-3">Menu</p>
        )}
        {NAV.map(({ to, icon, label, end }) => (
          <SideNavItem
            key={to}
            to={to} icon={icon} label={label} end={end}
            badge={label === 'Inquiries' ? unreadCount : 0}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="px-3 py-4 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2.5 mb-2 rounded-lg bg-zinc-900 border border-[var(--border)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center
                              text-[10px] font-bold text-white flex-shrink-0">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <p className="text-xs font-semibold text-zinc-300 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-zinc-500 hover:text-red-400
                     hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Layout root
══════════════════════════════════════════════════════════════ */
export default function Layout() {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [bellOpen, setBellOpen]       = useState(false);
  const bellRef                       = useRef(null);

  const { notifications, clearAll, clearOne } = useInquiryNotifications();
  const unreadCount = notifications.length;

  /* Close bell on outside click */
  useEffect(() => {
    const handler = e => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">

      {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r border-[#1a1a1a]"
        style={{ width: collapsed ? '4.5rem' : '15rem' }}
      >
        <SidebarContent
          collapsed={collapsed}
          user={user}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />
      </aside>

      {/* ── MOBILE SIDEBAR DRAWER ───────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute top-0 left-0 h-full w-72 flex flex-col animate-slide-drawer border-r border-zinc-800 shadow-2xl"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              collapsed={false}
              user={user}
              onLogout={handleLogout}
              unreadCount={unreadCount}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── MAIN AREA ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* ── Top Bar SaaS Style ───────────────────────── */}
        <header className="glass flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              className="hidden md:flex p-1 -ml-1 text-zinc-600 hover:text-zinc-300 transition"
              onClick={() => setCollapsed(c => !c)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-300 tracking-wide uppercase">Operational</span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(o => !o)}
                className={`p-2 rounded-full transition-colors relative 
                  ${bellOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
              >
                {unreadCount > 0 ? <BellRing className="w-5 h-5 text-emerald-400" /> : <Bell className="w-5 h-5" />}
                
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-[var(--bg-app)] animate-pulse" />
                )}
              </button>

              {/* Bell Dropdown Panel */}
              {bellOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] w-80 rounded-xl shadow-2xl z-50 border border-zinc-800 bg-[#0f0f0f] animate-fade-in">
                  
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={clearAll} className="text-xs font-medium text-zinc-500 hover:text-red-400 transition">
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center flex flex-col items-center">
                        <Moon className="w-8 h-8 opacity-20 text-zinc-500 mb-3" />
                        <p className="text-sm font-medium text-zinc-300">Quiet right now</p>
                        <p className="text-xs text-zinc-500 mt-1">No new notifications.</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} className="group flex items-start gap-4 px-5 py-4 hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 last:border-0 relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white line-clamp-1">{n.name}</p>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-zinc-600 font-medium mt-1 uppercase tracking-widest">{relTime(n.time)}</p>
                        </div>
                        <button
                          onClick={() => clearOne(n.id)}
                          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white rounded transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-zinc-800 bg-zinc-900/50 rounded-b-xl">
                    <Link
                      to="/inquiries"
                      onClick={() => setBellOpen(false)}
                      className="block w-full text-center py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 rounded-lg transition"
                    >
                      View all in Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar block */}
            <div className="hidden sm:block w-px h-6 bg-zinc-800" />
            <div className="w-8 h-8 rounded-full border border-zinc-700 bg-[var(--bg-surface)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            
          </div>
        </header>

        {/* ── Page Content ────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
