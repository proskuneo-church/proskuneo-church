import { services } from "../data/siteData";

export default function ServiceScheduleSection() {
  return (
    <section className="section" id="schedule">
      <div className="container">
        <h2 className="section-title">Jadwal Ibadah</h2>
        <p className="section-subtitle">Mari beribadah bersama dalam suasana yang hangat dan penuh hadirat Tuhan.</p>

        <div className="schedule-grid">
          {services.map((service) => (
            <article key={`${service.name}-${service.time}`} className="schedule-card">
              <h3 className="schedule-name">{service.name}</h3>
              <p className="schedule-day">{service.dayLabel}</p>
              <p className="schedule-time">{service.time} WIB</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

