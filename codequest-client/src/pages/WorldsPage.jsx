import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../useAuth";
import Navbar from "../Components/NavBar";

export default function WorldsPage() {
  const { user } = useAuth();
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  api
    .get("/api/worlds")
    .then((data) => {
      setWorlds(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) setError("The API returned an unexpected response.");
    })
    .catch(() => setError("Could not load the worlds."))
    .finally(() => setLoading(false));
}, []);

  const totalLevels = worlds.reduce((sum, w) => sum + w.totalLevels, 0);
  const completedLevels = worlds.reduce((sum, w) => sum + w.completedLevels, 0);
  const percent = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Welcome back, {user.userName}</h1>
        <p className="muted">
          {completedLevels} of {totalLevels} levels completed
        </p>
        <div className="bar" style={{ maxWidth: 480 }}>
          <div className="bar-fill" style={{ width: `${percent}%` }} />
        </div>

        {loading && <p className="muted">Loading...</p>}
        {error && <p className="error">{error}</p>}

        <section className="worlds">
          {worlds.map((world) => (
            <WorldCard key={world.id} world={world} />
          ))}
        </section>
      </main>
    </div>
  );
}

function WorldCard({ world }) {
  const next = world.levels.find((l) => l.isUnlocked && !l.isCompleted);
  const target = next ?? world.levels[0];
  const percent =
    world.totalLevels === 0 ? 0 : Math.round((world.completedLevels / world.totalLevels) * 100);

  let label = "Continue";
  if (world.completedLevels === 0) label = "Start";
  else if (!next) label = "Review";

  return (
    <article className="card world-card">
      <h3>{world.title}</h3>
      <p className="muted">{world.description}</p>

      <div className="levels-row">
        {world.levels.map((level, index) => {
          const state = level.isCompleted ? "done" : level.isUnlocked ? "cur" : "";

          return level.isUnlocked ? (
            <Link key={level.id} to={`/levels/${level.id}`} className={`lv ${state}`} title={level.title}>
              {index + 1}
            </Link>
          ) : (
            <span key={level.id} className="lv" title="Locked">
              {index + 1}
            </span>
          );
        })}
      </div>

      <div className="bar">
        <div className="bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="muted">
        {world.isUnlocked
          ? `${world.completedLevels} of ${world.totalLevels} levels`
          : "Locked until the previous world is complete"}
      </span>

      {world.isUnlocked && target ? (
        <Link className="btn primary" to={`/levels/${target.id}`}>
          {label}
        </Link>
      ) : (
        <button className="btn" disabled>
          {world.isUnlocked ? "No levels yet" : "Locked"}
        </button>
      )}
    </article>
  );
}
