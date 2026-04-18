import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth() {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) {
    return (
      <div className="auth-message">
        <h2>Supabase Not Configured</h2>
        <p>Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY agar admin panel dapat digunakan.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="auth-message">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
