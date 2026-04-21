import { memberServices } from "../../data/siteContent";
import SectionHeading from "../common/SectionHeading";

export default function MemberServicesSection() {
  return (
    <section className="section" id="services">
      <div className="site-container">
        <SectionHeading title="Ministries" subtitle="Berbagai bidang pelayanan sebagai wadah untuk melayani dan bertumbuh." />

        <div className="service-clean-grid">
          {memberServices.map((item) => (
            <article key={item.title} className="service-clean-item reveal-on-scroll">
              <span className="service-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="service-actions">
                <a href={item.url} target="_blank" rel="noreferrer" className="button-inline">
                  Buka Form
                </a>
                <a href={item.fallbackUrl} target="_blank" rel="noreferrer" className="button-inline alt">
                  WhatsApp Admin
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
