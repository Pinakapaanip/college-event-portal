import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const demoAuth = localStorage.getItem('demoAuth') === 'true';

  if (!isAuthenticated && !demoAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
