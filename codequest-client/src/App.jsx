import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import { useAuth } from "./useAuth";
import LoginPage from "./pages/LoginPage";
import WorldsPage from "./pages/WorldsPage";
import LevelPage from "./pages/LevelPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminWorldsPage from "./pages/Admin/AdminWorldsPage";
import AdminLevelsPage from "./pages/Admin/AdminLevelPage";
import LevelFormPage from "./pages/Admin/LevelFormPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <main className="page">
          <p className="muted">Loading your account...</p>
        </main>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <main className="page">
          <p className="muted">Loading your account...</p>
        </main>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return user.isAdmin ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><WorldsPage /></ProtectedRoute>} />
          <Route path="/levels/:id" element={<ProtectedRoute><LevelPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminWorldsPage /></AdminRoute>} />
          <Route path="/admin/worlds/:worldId" element={<AdminRoute><AdminLevelsPage /></AdminRoute>} />
          <Route path="/admin/worlds/:worldId/levels/new" element={<AdminRoute><LevelFormPage /></AdminRoute>} />
          <Route path="/admin/levels/:id/edit" element={<AdminRoute><LevelFormPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
