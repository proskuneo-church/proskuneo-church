import { useState } from "react";
import { churchMeta } from "../../data/siteContent";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();

  const canOpenAdmin = Boolean(
    user && (profile?.role === "admin" || profile?.role === "super_admin"),
  );

  return (
    <header className="site-navbar">
      <div className="site-container navbar-inner">
        <a className="brand-link" href="#home" onClick={() => setOpen(false)}>
          <img src="/images/logogambar.png" alt="Proskuneo Church logo" className="brand-logo" />
          <span className="brand-copy">
            <strong>{churchMeta.name}</strong>
            <span>{churchMeta.location}</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-menu ${open ? "open" : ""}`}>
          {churchMeta.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}

          {canOpenAdmin ? (
            <a href="/admin" className="admin-link" onClick={() => setOpen(false)}>
              Admin
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
