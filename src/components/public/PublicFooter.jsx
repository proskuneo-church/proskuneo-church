import { churchMeta } from "../../data/siteContent";

export default function PublicFooter() {
  return (
    <footer className="footer-main" id="contact">
      <div className="site-container footer-grid-main">
        <div>
          <h3>{churchMeta.name}</h3>
          <p>Jl. Dharmahusada Indah Barat III-A No.153-155</p>
          <p>Surabaya, Jawa Timur</p>
          {/*<p>
            WhatsApp: <a href={churchMeta.whatsappUrl}>{churchMeta.whatsappDisplay}</a>
          </p>*/}
        </div>

        <div>
          <h4>Connect</h4>
          <div className="social-wrap">
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
      <div className="site-container footer-copy">(c) {new Date().getFullYear()} {churchMeta.name}</div>
    </footer>
  );
}
