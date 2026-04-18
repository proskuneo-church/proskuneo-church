import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import MessageBlock from "../../components/common/MessageBlock";

export default function AdminLoginPage() {
  const { user, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!supabase) return;

    try {
      setLoading(true);
      setError("");

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (loginError) throw loginError;

      const destination = location.state?.from?.pathname || "/admin";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Admin Panel</p>
        <h1>Sign In</h1>
        <p>Masuk menggunakan akun Supabase Auth Anda.</p>

        {!isSupabaseConfigured ? (
          <MessageBlock
            type="error"
            title="Supabase not configured"
            message="Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env"
          />
        ) : null}

        {error ? <MessageBlock type="error" message={error} /> : null}

        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>

        <button type="submit" className="button-primary" disabled={loading || !isSupabaseConfigured}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <Link to="/" className="back-home-link">
          Back to Home
        </Link>
      </form>
    </div>
  );
}
