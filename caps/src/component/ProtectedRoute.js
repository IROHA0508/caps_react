// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');

  if (!user) {
    console.warn('🔒 접근 차단: 로그인 필요');
    return <Navigate to="/onboarding" />;
  }

  return children;
}

export default ProtectedRoute;
