import { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../../lib/cmsApi";
import { getAbsoluteUrl } from "../../lib/seo";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

function getFeaturedMeta(dateValue, timeValue) {
  const fallback = {
    dayTime: timeValue ? `${timeValue.slice(0, 5)} WIB` : "-",
    dateText: "-",
  };

  if (!dateValue) return fallback;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return fallback;

  const day = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(parsed);
  const fullDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
  const time = timeValue?.slice(0, 5) || "00:00";

  return {
    dayTime: `${day}, ${time} WIB`,
    dateText: fullDate,
  };
}

export default function FeaturedEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlt, setSelectedAlt] = useState("Featured event poster");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchEvents({
          type: "featured",
          orderBy: "created_at",
          ascending: false,
        });
        setEvents(rows || []);
      } catch (err) {
        setError(err.message || "Failed to load featured events");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const visibleEvents = useMemo(
    () => events.filter((event) => Boolean(event?.image_url)),
    [events],
  );
  const eventSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: visibleEvents.slice(0, 12).map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Event",
          name: event.title || `Featured Event ${index + 1}`,
          image: event.image_url,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          startDate: event.date && event.time ? `${event.date}T${event.time}` : event.date,
          url: getAbsoluteUrl("/#featured-events"),
          location: {
            "@type": "Place",
            name: "Proskuneo Church",
            address: "Surabaya, Jawa Timur, Indonesia",
          },
          organizer: {
            "@type": "Organization",
            name: "Proskuneo Church",
            url: getAbsoluteUrl("/"),
          },
        },
      })),
    }),
    [visibleEvents],
  );

  useEffect(() => {
    if (!selectedImage) return undefined;

    const { overflow } = document.body.style;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [selectedImage]);

  return (
    <section className="section section-alt" id="featured-events">
      <div className="site-container">
        <SectionHeading
          title="Featured Events"
          subtitle="Acara utama gereja untuk membangun iman dan kebersamaan jemaat."
        />

        {loading ? <LoadingBlock label="Loading featured events..." /> : null}
        {error ? <MessageBlock type="error" title="Featured events unavailable" message={error} /> : null}

        {!loading && !error && visibleEvents.length === 0 ? (
          <MessageBlock message="Belum ada featured events. Tambahkan dari admin panel." />
        ) : null}

        {!loading && !error && visibleEvents.length > 0 ? (
          <div className="featured-modern-grid">
            {visibleEvents.map((event) => {
              const meta = getFeaturedMeta(event.date, event.time);

              return (
                <article key={event.id} className="featured-modern-card reveal-on-scroll">
                  <div
                    className="featured-modern-media"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedImage(event.image_url);
                      setSelectedAlt(event.title || "Featured event poster");
                    }}
                    onKeyDown={(keyboardEvent) => {
                      if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                        keyboardEvent.preventDefault();
                        setSelectedImage(event.image_url);
                        setSelectedAlt(event.title || "Featured event poster");
                      }
                    }}
                  >
                    <img src={event.image_url} alt={event.title || "Featured event poster"} loading="lazy" />
                    {event.badge && event.badge.trim() ? (
                      <span className="featured-modern-badge">{event.badge.trim()}</span>
                    ) : null}
                  </div>
                  <div className="featured-modern-content">
                    <h3>{event.title}</h3>
                    <div className="featured-modern-meta">
                      <p>{meta.dayTime}</p>
                      <p>{meta.dateText}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      {selectedImage ? (
        <div className="featured-poster-modal" onClick={() => setSelectedImage(null)}>
          <button
            type="button"
            className="featured-poster-modal-close"
            aria-label="Close poster preview"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedImage(null);
            }}
          >
            X
          </button>
          <img
            src={selectedImage}
            alt={selectedAlt}
            className="featured-poster-modal-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}

      {!loading && !error && visibleEvents.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      ) : null}
    </section>
  );
}
