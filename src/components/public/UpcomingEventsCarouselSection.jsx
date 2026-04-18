import { useEffect, useMemo, useRef, useState } from "react";
import { fetchEvents } from "../../lib/cmsApi";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

export default function UpcomingEventsCarouselSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomPoster, setZoomPoster] = useState(null);
  const railRef = useRef(null);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await fetchEvents({ type: "upcoming" });
        setEvents(rows);
      } catch (err) {
        setError(err.message || "Failed to load upcoming posters");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const canSlide = useMemo(() => events.length > 1, [events.length]);
  const loopEvents = useMemo(() => (canSlide ? [...events, ...events] : events), [canSlide, events]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft = 0;
  }, [events.length]);

  const keepRailInLoop = () => {
    if (!canSlide) return;

    const rail = railRef.current;
    if (!rail) return;

    const loopWidth = rail.scrollWidth / 2;
    if (loopWidth <= 0) return;

    if (rail.scrollLeft < 0) {
      rail.scrollLeft += loopWidth;
    }

    if (rail.scrollLeft >= loopWidth) {
      rail.scrollLeft -= loopWidth;
    }
  };

  const nudgeByCard = (direction) => {
    if (!canSlide) return;

    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector(".upcoming-poster-item");
    if (!firstCard) return;

    const styles = window.getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    pauseUntilRef.current = performance.now() + 900;

    rail.scrollBy({
      left: direction * step,
      behavior: "smooth"
    });

    window.setTimeout(keepRailInLoop, 430);
  };

  useEffect(() => {
    if (!canSlide || zoomPoster) return undefined;

    const rail = railRef.current;
    if (!rail) return undefined;

    let rafId = null;
    let lastTimestamp = null;

    const animate = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (timestamp < pauseUntilRef.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Slightly faster than before to avoid "too slow" feel.
      const speed = 0.09;
      rail.scrollLeft += delta * speed;
      keepRailInLoop();

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [canSlide, zoomPoster]);

  return (
    <section className="section" id="upcoming-events">
      <div className="site-container">
        <SectionHeading
          title="Upcoming Services Posters"
          subtitle="Auto-scroll smooth infinite loop dengan tombol kiri dan kanan untuk geser manual."
        />

        {loading ? <LoadingBlock label="Loading upcoming posters..." /> : null}
        {error ? <MessageBlock type="error" title="Upcoming posters unavailable" message={error} /> : null}

        {!loading && !error && events.length === 0 ? <MessageBlock message="Belum ada poster upcoming." /> : null}

        {!loading && !error && events.length > 0 ? (
          <>
            <div className="upcoming-poster-carousel">
              <button
                type="button"
                className="carousel-nav"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  nudgeByCard(-1);
                }}
                aria-label="Previous posters"
              >
                &lsaquo;
              </button>
              <div className="upcoming-strip" ref={railRef} id="upcoming-poster-strip">
                {loopEvents.map((event, index) => (
                  <article
                    className="upcoming-poster-item"
                    key={`${event.id}-${index}`}
                    onClick={() => setZoomPoster(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(keyboardEvent) => {
                      if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                        setZoomPoster(event);
                      }
                    }}
                  >
                    <img src={event.image_url} alt={event.title || "Upcoming service poster"} loading="lazy" />
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="carousel-nav"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  nudgeByCard(1);
                }}
                aria-label="Next posters"
              >
                &rsaquo;
              </button>
            </div>

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
