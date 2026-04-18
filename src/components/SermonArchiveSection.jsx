import { sermonArchive } from "../data/siteData";

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function SermonArchiveSection() {
  const sortedSermons = [...sermonArchive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="section" id="sermons">
      <div className="container">
        <h2 className="section-title">Arsip Khotbah</h2>
        <p className="section-subtitle">Rekaman terbaru selalu tampil lebih dulu agar mudah diakses kapan saja.</p>

        <div className="horizontal-scroll">
          {sortedSermons.map((sermon) => (
            <article key={`${sermon.date}-${sermon.service}-${sermon.speaker}`} className="sermon-card">
              <p className="sermon-date">{formatDate(sermon.date)}</p>
              <h3 className="sermon-name">{sermon.service}</h3>
              <p className="sermon-speaker">{sermon.speaker}</p>
              <audio controls className="sermon-audio" preload="none">
                <source src={sermon.audioUrl} type="audio/mpeg" />
                Browser Anda belum mendukung audio player.
              </audio>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

