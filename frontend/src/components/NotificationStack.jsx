import { useNotifications } from '../context/NotificationContext';

export default function NotificationStack() {
  const { notifications } = useNotifications();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`portal-panel px-4 py-3 ${
            notification.type === 'error'
              ? 'border-rose-400/30 text-rose-50'
              : notification.type === 'success'
                ? 'border-emerald-400/30 text-emerald-50'
                : 'border-[rgba(212,175,55,0.35)] text-white'
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
