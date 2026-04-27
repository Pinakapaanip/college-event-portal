import { Menu, MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick, title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="portal-topbar sticky top-0 z-30 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="portal-icon-button lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="portal-heading text-lg sm:text-2xl">{title}</h2>
            <p className="portal-subtext text-xs sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="portal-chip hidden px-4 py-2 text-sm md:block">
            {user?.email}
          </div>
          <button
            onClick={toggleTheme}
            className="portal-icon-button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
