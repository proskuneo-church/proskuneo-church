import { useState } from "react";
import { churchInfo, navLinks } from "../data/siteData";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#home" className="brand" onClick={handleLinkClick}>
          {churchInfo.name}
          <span>{churchInfo.location}</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

