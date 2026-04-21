import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../../lib/cmsApi";
import SectionHeading from "../../components/common/SectionHeading";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

export default function UpcomingPostersPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomPoster, setZoomPoster] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchEvents({
          type: "upcoming",
          orderBy: "created_at",
          ascending: false,
        });
        setEvents(rows || []);
      } catch (err) {
        setError(err.message || "Failed to load all upcoming posters");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const posters = useMemo(() => events.filter((item) => Boolean(item?.image_url)), [events]);

  return (
    <main className="section">
      <div className="site-container">
        <div className="upcoming-page-head">
          <SectionHeading
            title="Semua Poster Ibadah"
            subtitle="Daftar lengkap poster/banner upcoming service. Klik poster untuk preview fullscreen."
          />
        </div>
        <div className="upcoming-back-wrap">
          <Link to="/#upcoming-events" className="upcoming-back-home-button">
            Back to Home
          </Link>
        </div>

        {loading ? <LoadingBlock label="Loading all upcoming posters..." /> : null}
        {error ? <MessageBlock type="error" title="Upcoming posters unavailable" message={error} /> : null}
        {!loading && !error && posters.length === 0 ? <MessageBlock message="Belum ada poster upcoming." /> : null}

        {!loading && !error && posters.length > 0 ? (
          <div className="upcoming-poster-grid">
            {posters.map((event) => (
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
      </div>
    </main>
  );
}
