import SectionHeading from "../common/SectionHeading";
import { services } from "../../data/serviceSchedule";

export default function ServiceScheduleSection() {
  return (
    <section className="section section-alt" id="schedule">
      <div className="site-container">
        <SectionHeading
          title="Jadwal Ibadah"
          subtitle="Jadwal teratur dan jadwal khusus pelayanan Proskuneo Church."
        />

        <div className="schedule-card-grid">
          {services.map((service) => (
            <article className="schedule-duo-card" key={`${service.name}-${service.dayText}-${service.time}`}>
              <h3>{service.name}</h3>
              <p className="day-text">{service.dayText}</p>
              <p className="time-text">{service.time} WIB</p>
              <p className="location-text">{service.location}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
