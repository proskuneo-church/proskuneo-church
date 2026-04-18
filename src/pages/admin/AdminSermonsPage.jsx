import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { deleteSermon, fetchSermons, upsertSermon, uploadToBucket } from "../../lib/cmsApi";
import { formatDateDisplay, formatDateInput, parseDateInputToIso } from "../../utils/formatters";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

const initialForm = {
  id: "",
  title: "",
  speaker: "",
  date: "",
  audio_url: "",
};

export default function AdminSermonsPage() {
  const { profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [audioFile, setAudioFile] = useState(null);
  const audioInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canDelete = useMemo(() => profile?.role !== "editor", [profile?.role]);

  const loadRows = async () => {
    const data = await fetchSermons();
    setRows(data);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await loadRows();
      } catch (err) {
        setError(err.message || "Failed to load sermons");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const clearAudioInput = () => {
    setAudioFile(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    clearAudioInput();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      const isCreateMode = !form.id;

      if (isCreateMode && !audioFile) {
        throw new Error("Upload file audio wajib saat create.");
      }

      if (!audioFile && !form.audio_url) {
        throw new Error("Audio file is required.");
      }

      const parsedDate = parseDateInputToIso(form.date);

      let audioUrl = form.audio_url;
      if (audioFile) {
        audioUrl = await uploadToBucket("sermon-audio", audioFile, "sermons");
      }

      await upsertSermon({
        id: form.id || undefined,
        title: form.title,
        speaker: form.speaker,
        date: parsedDate,
        audio_url: audioUrl,
      });

      resetForm();
      await loadRows();
    } catch (err) {
      setError(err.message || "Failed to save sermon");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      speaker: item.speaker,
      date: formatDateInput(item.date),
      audio_url: item.audio_url || "",
    });
    clearAudioInput();
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this sermon?")) return;

    try {
      await deleteSermon(id);
      await loadRows();
    } catch (err) {
      setError(err.message || "Failed to delete sermon");
    }
  };

  return (
    <div className="admin-page-grid">
      <section>
        <h1 className="admin-page-title">Sermon Management</h1>
        <p className="admin-page-subtitle">Kelola metadata khotbah dan upload file audio dari admin panel.</p>

        {loading ? <LoadingBlock label="Loading sermons..." /> : null}
        {error ? <MessageBlock type="error" message={error} /> : null}

        <div className="admin-list">
          {rows.map((item) => (
            <article key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.speaker}</p>
              <p>{formatDateDisplay(item.date)}</p>
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
          <h3>{form.id ? "Edit Sermon" : "New Sermon"}</h3>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>

          <label>
            Speaker
            <input
              value={form.speaker}
              onChange={(event) => setForm((prev) => ({ ...prev, speaker: event.target.value }))}
              required
            />
          </label>

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
            Audio URL (optional)
            <input
              value={form.audio_url}
              onChange={(event) => setForm((prev) => ({ ...prev, audio_url: event.target.value }))}
            />
          </label>

          <label>
            Upload Audio
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
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
