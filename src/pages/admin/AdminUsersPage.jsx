import { useEffect, useState } from "react";
import { createUserWithRole, fetchProfiles, updateProfileRole } from "../../lib/cmsApi";
import LoadingBlock from "../../components/common/LoadingBlock";
import MessageBlock from "../../components/common/MessageBlock";

const roleOptions = ["super_admin", "admin", "editor"];

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({ email: "", password: "", role: "editor" });

  const loadProfiles = async () => {
    const data = await fetchProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        await loadProfiles();
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setNotice("");

      await createUserWithRole(form);
      await loadProfiles();

      setForm({ email: "", password: "", role: "editor" });
      setNotice("User created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create user. Pastikan signup diaktifkan dan role policy profiles benar.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateProfileRole(id, role);
      await loadProfiles();
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
  };

  return (
    <div className="admin-page-grid">
      <section>
        <h1 className="admin-page-title">User Management</h1>
        <p className="admin-page-subtitle">Khusus super admin: membuat user dan mengatur role akses panel.</p>

        {loading ? <LoadingBlock label="Loading users..." /> : null}
        {error ? <MessageBlock type="error" message={error} /> : null}
        {notice ? <MessageBlock type="success" message={notice} /> : null}

        <div className="admin-list">
          {profiles.map((user) => (
            <article key={user.id}>
              <h4>{user.email}</h4>
              <label>
                Role
                <select value={user.role} onChange={(event) => handleRoleChange(user.id, event.target.value)}>
                  {roleOptions.map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>

      <section>
        <form className="admin-form" onSubmit={handleCreate}>
          <h3>Create User</h3>

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <label>
            Temporary Password
            <input
              type="password"
              required
              minLength="8"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <button className="button-primary" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create User"}
          </button>
        </form>
      </section>
    </div>
  );
}
