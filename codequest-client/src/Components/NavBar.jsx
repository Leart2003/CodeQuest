import { Link } from "react-router-dom";
import { useAuth } from "../useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/" className="brand nav-brand">
        Code<span className="accent">Quest</span>
      </Link>
      <div className="nav-right">
        <Link to="/leaderboard">Leaderboard</Link>
        <span className="chip xp">{user.totalXp} XP</span>
        <button className="btn" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
