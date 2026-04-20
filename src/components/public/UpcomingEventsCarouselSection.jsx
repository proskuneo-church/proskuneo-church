import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../../lib/cmsApi";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

function getPreviewLimit(width) {
  if (width <= 540) return 3;
  if (width <= 1024) return 6;
  return 9;
}

export default function UpcomingEventsCarouselSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomPoster, setZoomPoster] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 1366;
    return window.innerWidth;
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchEvents({
          type: "upcoming",
          orderBy: "created_at",
          ascending: false,
          limit: 60,
        });
        setEvents(rows || []);
      } catch (err) {
        setError(err.message || "Failed to load upcoming posters");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const posters = useMemo(() => events.filter((item) => Boolean(item?.image_url)), [events]);
  const previewLimit = useMemo(() => getPreviewLimit(viewportWidth), [viewportWidth]);
  const visibleEvents = useMemo(() => posters.slice(0, previewLimit), [posters, previewLimit]);
  const hasMore = posters.length > previewLimit;

  return (
    <section className="section" id="upcoming-events">
      <div className="site-container">
        <SectionHeading
          title="Upcoming Services Posters"
          subtitle="Preview poster terbaru: desktop 9, tablet 6, mobile 3. Klik poster untuk lihat versi penuh."
        />

        {loading ? <LoadingBlock label="Loading upcoming posters..." /> : null}
        {error ? <MessageBlock type="error" title="Upcoming posters unavailable" message={error} /> : null}

        {!loading && !error && visibleEvents.length === 0 ? <MessageBlock message="Belum ada poster upcoming." /> : null}

        {!loading && !error && visibleEvents.length > 0 ? (
          <>
            <div className="upcoming-poster-grid">
              {visibleEvents.map((event) => (
                <article
                  className="upcoming-grid-card"
                  key={event.id}
                  onClick={() => setZoomPoster(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                      keyboardEvent.preventDefault();
                      setZoomPoster(event);
                    }
                  }}
                >
                  <img src={event.image_url} alt={event.title || "Upcoming service poster"} loading="lazy" />
                  <div className="upcoming-grid-overlay" />
                  {event.badge && event.badge.trim() ? (
                    <span className="upcoming-grid-badge">{event.badge.trim()}</span>
                  ) : null}
                  {event.title ? <p className="upcoming-grid-title">{event.title}</p> : null}
                </article>
              ))}
            </div>

            {hasMore ? (
              <div className="upcoming-more-wrap">
                <Link to="/upcoming-posters" className="button-secondary upcoming-more-button">
                  Info Selengkapnya
                </Link>
              </div>
            ) : null}

            {zoomPoster ? (
              <div className="poster-lightbox" onClick={() => setZoomPoster(null)}>
                <button
                  type="button"
                  className="lightbox-close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoomPoster(null);
                  }}
                >
                  X
                </button>
                <img
                  src={zoomPoster.image_url}
                  alt={zoomPoster.title || "Poster Preview"}
                  className="lightbox-image"
                  onClick={(event) => event.stopPropagation()}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
