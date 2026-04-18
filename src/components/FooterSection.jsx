import { churchInfo, socialLinks } from "../data/siteData";

export default function FooterSection() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-brand">{churchInfo.name}</h3>
            <p className="footer-text">{churchInfo.theme}</p>
            <p className="footer-contact">{churchInfo.address}</p>
            <p className="footer-contact">
              WhatsApp: <a href={churchInfo.whatsapp}>{churchInfo.whatsapp.replace("https://wa.me/", "+")}</a>
            </p>
          </div>

          <div>
            <h3 className="footer-brand">Connect</h3>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="copyright">© {new Date().getFullYear()} Proskuneo Church. All rights reserved.</p>
      </div>
    </footer>
  );
}

