import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorMessages } from "../../api";

const TYPE_LABELS = {
  MultipleChoice: "Multiple choice",
  FillInTheBlank: "Fill in the blank",
  SpotTheBug: "Spot the bug",
  OrderTheLines: "Order the lines",
};

export default function AdminLevelsPage() {
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [levels, setLevels] = useState([]);
  const [errors, setErrors] = useState([]);

  async function load() {
    try {
      const [worlds, levelList] = await Promise.all([
        api.get("/api/admin/worlds"),
        api.get(`/api/admin/levels?worldId=${worldId}`),
      ]);
      setWorld(worlds.find((w) => w.id === Number(worldId)) ?? null);
      setLevels(levelList);
    } catch (err) {
      setErrors(errorMessages(err));
    }
  }

  useEffect(() => {
    load();
  }, [worldId]);

  async function remove(level) {
    const ok = window.confirm(
      `Delete "${level.title}"? Player progress on this level will be deleted too.`
    );
    if (!ok) return;

    try {
      await api.delete(`/api/admin/levels/${level.id}`);
      await load();
    } catch (err) {
      setErrors(errorMessages(err));
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <Link to="/admin">Back to worlds</Link>

        <div className="admin-bar">
          <h1>{world ? `Levels: ${world.title}` : "Levels"}</h1>
          <Link className="btn primary" to={`/admin/worlds/${worldId}/levels/new`}>
            New level
          </Link>
        </div>

        {errors.length > 0 && (
          <ul className="error-list">
            {errors.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        )}

        <section className="card" style={{ overflowX: "auto" }}>
          <table className="board">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Type</th>
                <th>XP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <tr key={level.id}>
                  <td>{level.order}</td>
                  <td>{level.title}</td>
                  <td>{TYPE_LABELS[level.challengeType]}</td>
                  <td>{level.xpReward}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn small-btn" to={`/admin/levels/${level.id}/edit`}>
                        Edit
                      </Link>
                      <button className="btn small-btn danger" onClick={() => remove(level)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {levels.length === 0 && <p className="muted">No levels in this world yet.</p>}
        </section>
      </main>
    </div>
  );
}