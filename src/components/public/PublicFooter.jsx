import { churchMeta } from "../../data/siteContent";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Devotional", href: "#devotional" },
  { label: "Events", href: "#featured-events" },
  { label: "Services", href: "#services" },
  { label: "Sermons", href: "#sermons" },
  { label: "Contact", href: "#contact" },
];

export default function PublicFooter() {
  return (
    <footer className="footer-main" id="contact">
      <div className="site-container footer-grid-main">
        <div className="footer-column">
          <h3 className="footer-title">Proskuneo Church</h3>
          <p className="footer-text-primary">
            Proskuneo Church is a community of faith where people grow in God and live out His purpose together.
          </p>
          <p className="footer-tagline">Faith • Community • Growth</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links-list">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Contact</h4>
          <p className="footer-text-secondary">{churchMeta.address}</p>
          {churchMeta.email ? <p className="footer-text-secondary">{churchMeta.email}</p> : null}
          <div className="footer-socials">
            {churchMeta.socials.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
            <a href={churchMeta.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="site-container footer-copy">© 2026 Proskuneo Church. All rights reserved.</div>
    </footer>
  );
}
