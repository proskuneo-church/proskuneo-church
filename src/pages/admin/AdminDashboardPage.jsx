import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../lib/cmsApi";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">Ringkasan konten website yang terhubung ke Supabase.</p>

      {loading ? <LoadingBlock label="Loading dashboard..." /> : null}
      {error ? <MessageBlock type="error" message={error} /> : null}

      {!loading && summary ? (
        <div className="admin-summary-grid">
          <article>
            <h3>Devotionals</h3>
            <p>{summary.devotionals}</p>
          </article>
          <article>
            <h3>Events</h3>
            <p>{summary.events}</p>
          </article>
          <article>
            <h3>Sermons</h3>
            <p>{summary.sermons}</p>
          </article>
          <article>
            <h3>Media Files</h3>
            <p>{summary.media}</p>
          </article>
        </div>
      ) : null}
    </div>
  );
}
