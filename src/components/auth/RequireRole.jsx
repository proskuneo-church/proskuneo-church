import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireRole({ roles, children }) {
  const { profile, loading } = useAuth();

  if (loading) return <div className="auth-message">Loading role...</div>;

  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
