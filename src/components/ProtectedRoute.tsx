import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to signin but save the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
