import { memberServices } from "../data/siteData";

export default function MemberServicesSection() {
  return (
    <section className="section" id="member-services">
      <div className="container">
        <h2 className="section-title">Pelayanan Jemaat</h2>
        <p className="section-subtitle">Ajukan kebutuhan pelayanan dengan cepat melalui formulir resmi gereja.</p>

        <div className="card-grid">
          {memberServices.map((service) => (
            <a
              key={service.name}
              href={service.formUrl}
              target="_blank"
              rel="noreferrer"
              className="service-card"
            >
              <div className="service-content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="service-link-note">Klik salah satu kartu untuk membuka Google Form.</p>
      </div>
    </section>
  );
}

