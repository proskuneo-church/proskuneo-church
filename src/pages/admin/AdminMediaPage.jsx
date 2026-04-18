import { useEffect, useRef, useState } from "react";
import { createMedia, fetchMedia, uploadToBucket } from "../../lib/cmsApi";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

export default function AdminMediaPage() {
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [type, setType] = useState("image");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRows = async () => {
    const data = await fetchMedia();
    setRows(data);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await loadRows();
      } catch (err) {
        setError(err.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const clearFileInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Upload file wajib sebelum create/save.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const bucket = type === "audio" ? "sermon-audio" : "media-library";
      const url = await uploadToBucket(bucket, file, type === "audio" ? "audio" : "images");

      await createMedia({ file_url: url, type });
      await loadRows();
      clearFileInput();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Media Upload</h1>
      <p className="admin-page-subtitle">Upload file gambar atau audio ke Supabase Storage.</p>

      {error ? <MessageBlock type="error" message={error} /> : null}

      <form className="admin-form single" onSubmit={handleUpload}>
        <label>
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
          </select>
        </label>

        <label>
          File
          <input
            ref={fileInputRef}
            type="file"
            accept={type === "audio" ? "audio/*" : "image/*"}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            required
          />
        </label>

        <button type="submit" className="button-primary" disabled={saving || !file}>
          {saving ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading ? <LoadingBlock label="Loading media library..." /> : null}

      <div className="media-grid">
        {rows.map((item) => (
          <article key={item.id}>
            <p>{item.type}</p>
            <a href={item.file_url} target="_blank" rel="noreferrer">
              {item.file_url}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
