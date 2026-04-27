import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import NotificationStack from '../components/NotificationStack';
import { APP_NAME } from '../config/brand';

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = `${APP_NAME} | Dashboard`;
  }, []);

  return (
    <div className="portal-shell min-h-screen">
      <div className="portal-shell__background pointer-events-none fixed inset-0 -z-0" />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} title={APP_NAME} subtitle="Centralized event management and analytics" />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <NotificationStack />
    </div>
  );
}
