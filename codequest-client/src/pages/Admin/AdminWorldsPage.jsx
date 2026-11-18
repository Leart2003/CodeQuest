import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessages } from "../../api";
import Navbar from "../../Components/NavBar";

const emptyForm = { title: "", description: "", order: 1 };

export default function AdminWorldsPage() {
  const [worlds, setWorlds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState([]);

  async function load() {
    try {
      const data = await api.get("/api/admin/worlds");
      setWorlds(data);
      return data;
    } catch (err) {
      setErrors(errorMessages(err));
      return [];
    }
  }

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/admin/worlds")
      .then((data) => {
        if (!cancelled) setWorlds(data);
      })
      .catch((err) => {
        if (!cancelled) setErrors(errorMessages(err));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function reset(count) {
    setEditingId(null);
    setForm({ ...emptyForm, order: count + 1 });
    setErrors([]);
  }

  function startEdit(world) {
    setEditingId(world.id);
    setForm({ title: world.title, description: world.description, order: world.order });
    setErrors([]);
  }

  async function save(e) {
    e.preventDefault();
    setErrors([]);

    const body = {
      title: form.title,
      description: form.description,
      order: Number(form.order),
    };

    try {
      if (editingId) await api.put(`/api/admin/worlds/${editingId}`, body);
      else await api.post("/api/admin/worlds", body);

      const data = await load();
      reset(data.length);
    } catch (err) {
      setErrors(errorMessages(err));
    }
  }

  async function remove(world) {
    const ok = window.confirm(
      `Delete "${world.title}"? Its levels and all player progress on them will be deleted too.`
    );
    if (!ok) return;

    try {
      await api.delete(`/api/admin/worlds/${world.id}`);
      const data = await load();
      reset(data.length);
    } catch (err) {
      setErrors(errorMessages(err));
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Admin: worlds</h1>

        <form className="card admin-form" onSubmit={save}>
          <h2>{editingId ? "Edit world" : "Add world"}</h2>

          <div className="field-row">
            <div style={{ flex: 3 }}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="order">Order</label>
              <input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {errors.length > 0 && (
            <ul className="error-list">
              {errors.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          )}

          <div className="row-actions">
            <button className="btn primary" type="submit">
              {editingId ? "Save changes" : "Add world"}
            </button>
            {editingId && (
              <button className="btn" type="button" onClick={() => reset(worlds.length)}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="card" style={{ marginTop: 24, overflowX: "auto" }}>
          <table className="board">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Levels</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {worlds.map((world) => (
                <tr key={world.id}>
                  <td>{world.order}</td>
                  <td>{world.title}</td>
                  <td>{world.levelCount}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn small-btn" to={`/admin/worlds/${world.id}`}>
                        Levels
                      </Link>
                      <button className="btn small-btn" onClick={() => startEdit(world)}>
                        Edit
                      </button>
                      <button className="btn small-btn danger" onClick={() => remove(world)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
