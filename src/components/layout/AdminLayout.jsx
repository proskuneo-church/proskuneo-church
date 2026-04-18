import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const adminMenu = [
  { label: "Dashboard", to: "/admin" },
  { label: "Devotionals", to: "/admin/devotionals" },
  { label: "Events", to: "/admin/events" },
  { label: "Sermons", to: "/admin/sermons" },
  { label: "Media", to: "/admin/media" },
  { label: "Users", to: "/admin/users", role: "super_admin" },
];

export default function AdminLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">
          <strong>Proskuneo CMS</strong>
          <span>{profile?.role || "admin"}</span>
        </a>

        <nav>
          {adminMenu
            .filter((item) => !item.role || item.role === profile?.role)
            .map((item) => (
              <NavLink
                to={item.to}
                end={item.to === "/admin"}
                key={item.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>

        <button className="button-ghost" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
