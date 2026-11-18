import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../useAuth";
import Navbar from "../Components/NavBar";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/leaderboard")
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load the leaderboard."));
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Leaderboard</h1>
        {error && <p className="error">{error}</p>}

        <section className="card">
          <table className="board">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Levels</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.rank} className={entry.username === user.userName ? "me" : ""}>
                  <td>{entry.rank}</td>
                  <td>{entry.username}</td>
                  <td>{entry.completedLevels}</td>
                  <td>{entry.totalXp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
