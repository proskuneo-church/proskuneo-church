import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestDevotional } from "../../lib/cmsApi";
import { excerpt } from "../../utils/formatters";
import SectionHeading from "../common/SectionHeading";
import LoadingBlock from "../common/LoadingBlock";
import MessageBlock from "../common/MessageBlock";

export default function DevotionalPreviewSection() {
  const [monthly, setMonthly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [monthlyData, dailyData] = await Promise.all([
          fetchLatestDevotional("monthly"),
          fetchLatestDevotional("daily"),
        ]);

        setMonthly(monthlyData);
        setDaily(dailyData);
      } catch (err) {
        setError(err.message || "Failed to load devotional previews");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="section" id="devotional">
      <div className="site-container">
        <SectionHeading
          title="Devotional"
          subtitle="Renungan bulanan dan harian tanpa elemen gambar, fokus penuh pada isi bacaan."
        />

        {loading ? <LoadingBlock label="Loading devotionals..." /> : null}
        {error ? <MessageBlock type="error" title="Failed to load" message={error} /> : null}

        {!loading && !error ? (
          <div className="devotional-text-grid">
            <article className="devotional-text-block reveal-on-scroll">
              <p className="eyebrow">Renungan Bulanan</p>
              <h3>{monthly?.title || "Belum ada renungan bulanan"}</h3>
              <p className="meta">{monthly?.author || "Admin"}</p>
              <p className="verse">{monthly?.verse || "Tambahkan ayat di panel admin"}</p>
              <p>{excerpt(monthly?.content || "", 45)}</p>
              {monthly?.slug ? (
                <Link to={`/devotional/bulanan/${monthly.slug}`} className="button-inline">
                  Read More
                </Link>
              ) : null}
            </article>

            <article className="devotional-text-block reveal-on-scroll">
              <p className="eyebrow">Renungan Harian</p>
              <h3>{daily?.title || "Belum ada renungan harian"}</h3>
              <p className="verse">{daily?.verse || "Tambahkan ayat di panel admin"}</p>
              <p>{excerpt(daily?.content || "", 35)}</p>
              {daily?.slug ? (
                <Link to={`/devotional/harian/${daily.slug}`} className="button-inline">
                  Read More
                </Link>
              ) : null}
            </article>
          </div>
        ) : null}
      </div>
    </section>
  );
}
