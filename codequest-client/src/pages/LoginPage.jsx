import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handle(action) {
    setError("");
    try {
      await action(username, password);
      navigate("/");
    } catch (err) {
      if (Array.isArray(err.data)) {
        setError(err.data.join(" "));
      } else if (err.data?.errors) {
        setError(Object.values(err.data.errors).flat().join(" "));
      } else {
        setError(err.data?.message ?? "Something went wrong.");
      }
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <span className="brand">
          Code<span className="accent">Quest</span>
        </span>
      </nav>

      <main className="center">
        <section className="hero">
          <h1>Learn C# one level at a time.</h1>
          <p className="muted">
            Solve small challenges, earn XP and climb the leaderboard.
          </p>
        </section>

        <form
          className="card form"
          onSubmit={(e) => {
            e.preventDefault();
            handle(login);
          }}
        >
          <h2>Welcome back</h2>

          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn primary" type="submit">
            Log in
          </button>
          <button className="btn" type="button" onClick={() => handle(register)}>
            Create account
          </button>
        </form>
      </main>
    </div>
  );
}