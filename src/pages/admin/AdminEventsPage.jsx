import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { deleteEvent, fetchEvents, upsertEvent, uploadToBucket } from "../../lib/cmsApi";
import {
  formatDateInput,
  formatDateTimeDisplay,
  normalize24HourTime,
  parseDateInputToIso,
} from "../../utils/formatters";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

const initialForm = {
  id: "",
  type: "featured",
  title: "",
  badge: "",
  date: "",
  time: "",
  location: "",
  speaker: "",
  image_url: "",
};

export default function AdminEventsPage() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [posterFile, setPosterFile] = useState(null);
  const posterInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canDelete = useMemo(() => profile?.role !== "editor", [profile?.role]);
  const featuredRows = useMemo(
    () => rows.filter((item) => (item.type || "featured") === "featured"),
    [rows],
  );
  const upcomingRows = useMemo(
    () => rows.filter((item) => item.type === "upcoming"),
    [rows],
  );

  const loadRows = async () => {
    const data = await fetchEvents({ orderBy: "date", ascending: true });
    setRows(data);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await loadRows();
      } catch (err) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const clearPosterInput = () => {
    setPosterFile(null);
    if (posterInputRef.current) {
      posterInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    clearPosterInput();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      const isFeatured = form.type === "featured";
      const isCreateMode = !form.id;

      if (isCreateMode && !posterFile) {
        throw new Error("Upload file poster wajib saat create.");
      }

      if (!posterFile && !form.image_url) {
        throw new Error("Poster image is required.");
      }

      if (isFeatured && (!form.date || !form.time)) {
        throw new Error("Featured event requires date and time.");
      }

      if (isFeatured && (!form.title || !form.location)) {
        throw new Error("Featured event requires title and location.");
      }

      const parsedFeaturedDate = isFeatured ? parseDateInputToIso(form.date) : null;
      const normalizedFeaturedTime = isFeatured ? normalize24HourTime(form.time) : null;
      const parsedUpcomingDate = !isFeatured && form.date ? parseDateInputToIso(form.date) : null;
      const normalizedUpcomingTime = !isFeatured && form.time ? normalize24HourTime(form.time) : null;

      let imageUrl = form.image_url;
      if (posterFile) {
        imageUrl = await uploadToBucket("event-posters", posterFile, "events");
      }

      const now = new Date();
      const fallbackDate = now.toISOString().slice(0, 10);
      const fallbackTime = now.toTimeString().slice(0, 5);

      await upsertEvent({
        id: form.id || undefined,
        type: form.type,
        title: isFeatured ? form.title : form.title || `Upcoming Poster ${fallbackDate}`,
        badge: form.badge.trim() || null,
        date: isFeatured ? parsedFeaturedDate : parsedUpcomingDate || fallbackDate,
        time: isFeatured ? normalizedFeaturedTime : normalizedUpcomingTime || fallbackTime,
        location: isFeatured ? form.location || null : null,
        speaker: isFeatured ? form.speaker || null : null,
        image_url: imageUrl,
      });

      resetForm();
      await loadRows();
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      type: row.type || "featured",
      title: row.title || "",
      badge: row.badge || "",
      date: formatDateInput(row.date),
      time: row.time ? row.time.slice(0, 5) : "",
      location: row.location || "",
      speaker: row.speaker || "",
      image_url: row.image_url || "",
    });
    clearPosterInput();
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);
      await loadRows();
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  };

  return (
    <div className="admin-page-grid">
      <section>
        <h1 className="admin-page-title">Event Management</h1>
        <p className="admin-page-subtitle">Pisahkan event besar (featured) dan poster ibadah mingguan (upcoming).</p>

        {loading ? <LoadingBlock label="Loading events..." /> : null}
        {error ? <MessageBlock type="error" message={error} /> : null}

        <div className="admin-events-groups">
          <div className="admin-list">
            <h3 className="admin-group-title">Featured Events ({featuredRows.length})</h3>
            {featuredRows.length === 0 ? <p className="admin-inline-note">Belum ada featured event.</p> : null}
            {featuredRows.map((item) => (
              <article key={item.id}>
                <h4>{item.title || "Untitled Event"}</h4>
                {item.badge ? <p>Badge: {item.badge}</p> : null}
                {item.date && item.time ? <p>{formatDateTimeDisplay(item.date, item.time)}</p> : null}
                {item.location ? <p>{item.location}</p> : null}
                {item.speaker ? <p>Speaker: {item.speaker}</p> : null}
                <div className="row-actions">
                  <button type="button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" disabled={!canDelete} onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-list">
            <h3 className="admin-group-title">Upcoming Posters ({upcomingRows.length})</h3>
            {upcomingRows.length === 0 ? <p className="admin-inline-note">Belum ada upcoming poster.</p> : null}
            {upcomingRows.map((item) => (
              <article key={item.id}>
                <h4>{item.title || "Untitled Event"}</h4>
                {item.badge ? <p>Badge: {item.badge}</p> : null}
                <p>Poster only</p>
                <div className="row-actions">
                  <button type="button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" disabled={!canDelete} onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{form.id ? "Edit Event" : "New Event"}</h3>

          <label>
            Event Type
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="featured">Featured Event</option>
              <option value="upcoming">Upcoming Poster</option>
            </select>
          </label>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder={form.type === "upcoming" ? "Optional (internal title)" : "Event title"}
              required={form.type === "featured"}
            />
          </label>

          <label>
            Badge (Optional)
            <input
              value={form.badge}
              onChange={(event) => setForm((prev) => ({ ...prev, badge: event.target.value }))}
              placeholder="Sunday Service / Youth / Special Event"
            />
          </label>

          {form.type === "featured" ? (
            <>
              <label>
                Date
                <input
                  type="text"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  placeholder="dd/mm/yyyy"
                  inputMode="numeric"
                  pattern="\d{2}/\d{2}/\d{4}"
                  title="Gunakan format dd/mm/yyyy"
                  required
                />
              </label>

              <label>
                Time
                <input
                  type="text"
                  value={form.time}
                  onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                  placeholder="HH:mm"
                  inputMode="numeric"
                  pattern="^([01]?\d|2[0-3]):([0-5]\d)$"
                  title="Gunakan format 24 jam, contoh 19:30"
                  required
                />
              </label>

              <label>
                Location
                <input
                  value={form.location}
                  onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  required
                />
              </label>

              <label>
                Speaker (optional)
                <input
                  value={form.speaker}
                  onChange={(event) => setForm((prev) => ({ ...prev, speaker: event.target.value }))}
                />
              </label>
            </>
          ) : (
            <p className="admin-inline-note">
              Upcoming hanya membutuhkan poster. Field lain bersifat internal dan akan diisi otomatis bila kosong.
            </p>
          )}

          <label>
            Poster URL (optional)
            <input
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            />
          </label>

          <label>
            Upload Poster
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => setPosterFile(event.target.files?.[0] || null)}
            />
          </label>

          <button className="button-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : form.id ? "Update" : "Create"}
          </button>

          {form.id ? (
            <button type="button" className="button-ghost" onClick={resetForm}>
              Cancel Edit
            </button>
          ) : null}
        </form>
      </section>
    </div>
  );
}
