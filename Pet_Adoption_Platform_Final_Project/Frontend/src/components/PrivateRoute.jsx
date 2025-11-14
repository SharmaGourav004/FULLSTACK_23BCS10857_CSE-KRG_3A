import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../api";

function PrivateRoute({ children, requiredRole = null }) {
  const token = getToken();
  const role = localStorage.getItem('role');
  const location = useLocation();
  
  if (!token) {
    // Only redirect if not already on login or register page
    if (location.pathname === '/login' || location.pathname === '/register') {
      return null;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default PrivateRoute;


