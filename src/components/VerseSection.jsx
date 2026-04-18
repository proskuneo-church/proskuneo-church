import { verseHighlights } from "../data/siteData";

export default function VerseSection() {
  return (
    <section className="section" id="verse">
      <div className="container">
        <h2 className="section-title">Ayat Pilihan</h2>
        <p className="section-subtitle">Renungan yang menolong kita bertumbuh dalam firman setiap musim.</p>

        <div className="verse-grid">
          {verseHighlights.map((verse) => (
            <article key={verse.title} className="verse-card">
              <img src={verse.image} alt={verse.title} className="verse-image" loading="lazy" />
              <div className="verse-body">
                <h3 className="verse-title">{verse.title}</h3>
                <p className="verse-text">{verse.preview}</p>
                <a href={verse.link} className="read-more">
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

