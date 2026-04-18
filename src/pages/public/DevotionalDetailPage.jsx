import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDevotionalBySlug } from "../../lib/cmsApi";
import { formatDateDisplay } from "../../utils/formatters";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

export default function DevotionalDetailPage({ type }) {
  const { slug } = useParams();
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const row = await fetchDevotionalBySlug(type, slug);
        setDevotional(row);
      } catch (err) {
        setError(err.message || "Failed to load devotional");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, type]);

  return (
    <div className="devotional-detail-page">
      <article className="reading-layout">
        {loading ? <LoadingBlock label="Loading devotional..." /> : null}
        {error ? <MessageBlock type="error" title="Unable to open devotional" message={error} /> : null}

        {!loading && !error && !devotional ? (
          <MessageBlock title="Not Found" message="Renungan tidak ditemukan atau sudah dipindahkan." />
        ) : null}

        {!loading && devotional ? (
          <>
            <p className="eyebrow">{type === "monthly" ? "Renungan Bulanan" : "Renungan Harian"}</p>
            <h1>{devotional.title}</h1>
            {type === "monthly" ? <p className="author">By {devotional.author || "Admin"}</p> : null}
            <p className="verse">{devotional.verse}</p>
            <p className="date">{formatDateDisplay(devotional.created_at)}</p>
            <div className="content">{devotional.content}</div>

            <Link to="/#devotional" className="button-inline detail-back-link">
              Back to Home
            </Link>
          </>
        ) : null}
      </article>
    </div>
  );
}
