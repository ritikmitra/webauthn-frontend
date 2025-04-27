import { Navigate } from 'react-router';
import { useAuth } from '../auth';



type ProtectedRouteProps = {
    children: React.ReactNode;
  };

  
const ProtectedRoute = ({ children } : ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
