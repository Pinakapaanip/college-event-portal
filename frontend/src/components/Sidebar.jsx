import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus2, CalendarDays, Users2, Trophy, ChartColumnBig, Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/brand';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'View Events', icon: CalendarDays },
  { to: '/events/add', label: 'Add Event', icon: CalendarPlus2 },
  { to: '/participants', label: 'Participants', icon: Users2 },
  { to: '/results', label: 'Results', icon: Trophy },
  { to: '/analytics', label: 'Analytics', icon: ChartColumnBig },
  { to: '/search', label: 'Search Events', icon: Search },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { logout, user } = useAuth();

  return (
    <aside
      className={`portal-sidebar fixed inset-y-0 left-0 z-40 w-72 p-5 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="portal-kicker">University Portal</p>
          <h1 className="mt-2 text-xl font-semibold text-white">{APP_NAME}</h1>
        </div>
        <button className="portal-icon-button lg:hidden" onClick={onClose} aria-label="Close navigation">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="portal-panel mb-6 p-4">
        <p className="portal-kicker">Signed in as</p>
        <p className="mt-2 text-sm font-semibold text-white">{user?.name}</p>
        <p className="text-xs text-white/70">{user?.role}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `portal-nav-link ${isActive ? 'portal-nav-link-active' : ''}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="portal-button-secondary mt-8 w-full justify-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
