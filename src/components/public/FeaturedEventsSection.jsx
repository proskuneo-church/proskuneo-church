import { useEffect, useState } from "react";
import { fetchEvents } from "../../lib/cmsApi";
import { formatDateTimeDisplay } from "../../utils/formatters";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

export default function FeaturedEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchEvents({ type: "featured" });
        setEvents(rows);
      } catch (err) {
        setError(err.message || "Failed to load featured events");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (events.length <= 3) return undefined;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <section className="section section-alt" id="featured-events">
      <div className="site-container">
        <SectionHeading
          title="Featured Events"
          subtitle="Acara besar gereja seperti Easter, Christmas, conference, seminar, dan KKR."
        />

        {loading ? <LoadingBlock label="Loading featured events..." /> : null}
        {error ? <MessageBlock type="error" title="Featured events unavailable" message={error} /> : null}

        {!loading && !error && events.length === 0 ? (
          <MessageBlock message="Belum ada featured events. Tambahkan dari admin panel." />
        ) : null}

        {!loading && !error && events.length > 0 && events.length <= 3 ? (
          <div className="featured-premium-grid">
            {events.map((event) => (
              <article key={event.id} className="featured-premium-card">
                {event.image_url ? <img src={event.image_url} alt={event.title} loading="lazy" /> : null}
                <div className="featured-premium-overlay">
                  <h3>{event.title}</h3>
                  <p>{formatDateTimeDisplay(event.date, event.time)}</p>
                  <p>{event.location || "Proskuneo Church Surabaya"}</p>
                  {event.speaker ? <p>Speaker: {event.speaker}</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!loading && !error && events.length > 3 ? (
          <div className="featured-premium-carousel">
            <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {events.map((event) => (
                <article key={event.id} className="featured-premium-slide">
                  {event.image_url ? <img src={event.image_url} alt={event.title} loading="lazy" /> : null}
                  <div className="featured-premium-overlay">
                    <h3>{event.title}</h3>
                    <p>{formatDateTimeDisplay(event.date, event.time)}</p>
                    <p>{event.location || "Proskuneo Church Surabaya"}</p>
                    {event.speaker ? <p>Speaker: {event.speaker}</p> : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="carousel-dots">
              {events.map((event, dotIndex) => (
                <button
                  key={event.id}
                  type="button"
                  className={dotIndex === index ? "active" : ""}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Go to featured event ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
