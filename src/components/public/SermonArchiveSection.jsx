import { useEffect, useState } from "react";
import { fetchSermons } from "../../lib/cmsApi";
import { formatDateDisplay } from "../../utils/formatters";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

export default function SermonArchiveSection() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await fetchSermons();
        setSermons(rows);
      } catch (err) {
        setError(err.message || "Failed to load sermons");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="section" id="sermons">
      <div className="site-container">
        <SectionHeading title="Sermon Archive" subtitle="Kumpulan khotbah untuk didengarkan kembali kapan saja." />

        {loading ? <LoadingBlock label="Loading sermons..." /> : null}
        {error ? <MessageBlock type="error" title="Sermons unavailable" message={error} /> : null}

        {!loading && !error ? (
          <div className="sermon-row">
            {sermons.map((sermon) => (
              <article key={sermon.id} className="sermon-item-main">
                <p className="date">{formatDateDisplay(sermon.date)}</p>
                <h3>{sermon.title}</h3>
                <p className="speaker">{sermon.speaker}</p>
                <audio controls preload="none">
                  <source src={sermon.audio_url} type="audio/mpeg" />
                  Browser Anda belum mendukung pemutar audio.
                </audio>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
