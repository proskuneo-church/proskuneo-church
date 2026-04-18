import { upcomingEvents } from "../data/siteData";

export default function UpcomingEventsSection() {
  return (
    <section className="section" id="events">
      <div className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">Momen spesial untuk bertumbuh bersama komunitas Proskuneo Church.</p>

        <div className="horizontal-scroll">
          {upcomingEvents.map((event) => (
            <article className="event-card" key={`${event.title}-${event.date}`}>
              <div className="event-image-wrap">
                <img src={event.poster} alt={event.title} className="event-image" loading="lazy" />
              </div>
              <div className="event-body">
                <p className="event-date">{event.date}</p>
                <h3 className="event-title">{event.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

