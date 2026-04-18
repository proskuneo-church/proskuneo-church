import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { deleteDevotional, fetchDevotionals, upsertDevotional } from "../../lib/cmsApi";
import { slugify } from "../../utils/formatters";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

const initialForm = {
  id: "",
  type: "monthly",
  title: "",
  author: "",
  verse: "",
  content: "",
};

export default function AdminDevotionalsPage() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const canDelete = useMemo(() => profile?.role !== "editor", [profile?.role]);

  const loadRows = async () => {
    const data = await fetchDevotionals();
    setRows(data);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        await loadRows();
      } catch (err) {
        setError(err.message || "Failed to load devotionals");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setNotice("");

      await upsertDevotional({
        id: form.id || undefined,
        type: form.type,
        title: form.title,
        slug: slugify(form.title),
        author: form.type === "monthly" ? form.author : null,
        verse: form.verse,
        content: form.content,
      });

      await loadRows();
      setForm(initialForm);
      setNotice("Devotional saved.");
    } catch (err) {
      setError(err.message || "Failed to save devotional");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      type: item.type,
      title: item.title,
      author: item.author || "",
      verse: item.verse,
      content: item.content,
    });
    setNotice("");
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this devotional?")) return;

    try {
      await deleteDevotional(id);
      await loadRows();
    } catch (err) {
      setError(err.message || "Failed to delete");
    }
  };

  return (
    <div className="admin-page-grid">
      <section>
        <h1 className="admin-page-title">Devotional Management</h1>
        <p className="admin-page-subtitle">Create, edit, dan atur renungan bulanan maupun harian.</p>

        {loading ? <LoadingBlock label="Loading devotionals..." /> : null}
        {error ? <MessageBlock type="error" message={error} /> : null}
        {notice ? <MessageBlock type="success" message={notice} /> : null}

        <div className="admin-list">
          {rows.map((item) => (
            <article key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.type === "monthly" ? "Monthly" : "Daily"}</p>
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
      </section>

      <section>
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{form.id ? "Edit Devotional" : "New Devotional"}</h3>

          <label>
            Type
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </label>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>

          {form.type === "monthly" ? (
            <label>
              Author
              <input
                value={form.author}
                onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                required
              />
            </label>
          ) : null}

          <label>
            Verse
            <input
              value={form.verse}
              onChange={(event) => setForm((prev) => ({ ...prev, verse: event.target.value }))}
              required
            />
          </label>

          <label>
            Content
            <textarea
              rows="10"
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              required
            />
          </label>

          <button type="submit" className="button-primary" disabled={saving}>
            {saving ? "Saving..." : form.id ? "Update" : "Create"}
          </button>
          {form.id ? (
            <button type="button" className="button-ghost" onClick={() => setForm(initialForm)}>
              Cancel Edit
            </button>
          ) : null}
        </form>
      </section>
    </div>
  );
}
