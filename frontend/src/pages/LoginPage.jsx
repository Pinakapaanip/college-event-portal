import { useEffect, useState } from 'react';
import { GraduationCap, ShieldCheck, MoonStar, SunMedium } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { APP_NAME } from '../config/brand';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('password');
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  useDocumentTitle(`${APP_NAME} | Login`);

  useEffect(() => {
    document.documentElement.dataset.page = 'login';
    return () => {
      delete document.documentElement.dataset.page;
    };
  }, []);

  const handleLogin = async () => {
    alert('Login clicked');
    console.log('LOGIN CLICKED');

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    setSubmitting(true);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('API RESPONSE', data);

      if (!response.ok || !data.success) {
        const errorMessage = data.message || 'Login failed.';
        alert(errorMessage);
        notify(errorMessage, 'error');
        return;
      }

      notify('Logged in successfully.', 'success');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('LOGIN ERROR', error);
      alert('Unable to login. Please try again.');
      notify('Unable to login. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(230,126,34,0.16),transparent_30%),linear-gradient(135deg,rgba(11,31,77,0.98),rgba(19,43,107,0.94))]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="portal-chip inline-flex w-fit items-center gap-3 px-4 py-2 text-sm text-white">
              <GraduationCap className="h-4 w-4" />
              {APP_NAME}
            </div>
            <button className="portal-icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
          </div>

          <div className="max-w-2xl py-16">
            <p className="portal-kicker text-white/80">University portal</p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Manage events, participants, and winners from one analytics-first portal.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Built for college administration teams that need fast event operations, clean reporting, and visual insights with a responsive interface.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                'JWT protected login and roles',
                'Modern dashboards and charts',
                'CSV export and filtering',
                'Mobile-first Tailwind UI',
              ].map((item) => (
                <div key={item} className="portal-panel p-4 text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="max-w-xl text-sm text-white/65">
            Designed for deployment on modern hosting platforms with a PostgreSQL backend.
          </p>
        </div>
      </div>

      <div className="portal-login-panel flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="portal-panel w-full max-w-md p-8">
          <div className="mb-8">
            <div className="portal-chip inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Access
            </div>
            <h2 className="portal-heading mt-4 text-3xl">Login to dashboard</h2>
            <p className="portal-subtext mt-2 text-sm">Use the admin account you create through the registration endpoint.</p>
          </div>

          <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
            <div>
              <label className="portal-label mb-2 block text-sm">Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="portal-input"
                placeholder="admin@college.edu"
              />
            </div>
            <div>
              <label className="portal-label mb-2 block text-sm">Password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="portal-input"
                placeholder="password"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={submitting}
              className="portal-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
