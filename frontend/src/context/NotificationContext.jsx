import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const { type = 'info', message } = event.detail || {};
      if (!message) return;
      const id = crypto.randomUUID();
      setNotifications((current) => [...current, { id, type, message }]);
      window.setTimeout(() => {
        setNotifications((current) => current.filter((item) => item.id !== id));
      }, 3200);
    };

    window.addEventListener('portal-notification', handler);
    return () => window.removeEventListener('portal-notification', handler);
  }, []);

  const notify = (message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('portal-notification', { detail: { type, message } }));
  };

  const value = useMemo(() => ({ notifications, notify }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
