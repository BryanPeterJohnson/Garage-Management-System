// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PreBooking from "./pages/PreBooking/index.jsx";
import CarIn from "./pages/CarIn/CarIn.jsx"; // ✅ NEW PAGE
import Login from "./pages/Login.jsx";
import { apiLogin, setToken, clearToken } from "./lib/api";
import Settings from "./pages/Settings/index.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  // Restore session on load
  useEffect(() => {
    const saved = localStorage.getItem("gms_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // REAL login via backend
  const handleLogin = useCallback(async (username, password) => {
    try {
      const { token, user } = await apiLogin(username, password);
      setToken(token);
      localStorage.setItem("gms_user", JSON.stringify(user));
      setUser(user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || "Network error" };
    }
  }, []);

  // Logout: clear token + user
  const handleLogout = useCallback(() => {
    clearToken();
    localStorage.removeItem("gms_user");
    setUser(null);
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        }
      />

      {/* Private */}
      <Route element={<RequireAuth user={user} />}>
        <Route element={<Shell user={user} onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/pre-booking" element={<PreBooking />} />
          <Route path="/car-in" element={<CarIn />} /> {/* ✅ NEW ROUTE */}
          <Route path="/settings" element={<Settings/>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

/* Guards + Layout (unchanged) */
function RequireAuth({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
function Shell({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <Sidebar
          username={`${user?.username} (${user?.userType ?? "user"})`} // shows userType too
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogoutClick}
        />
      )}
      <main className="flex-1 p-6">
        {!sidebarOpen && (
          <button
            className="mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
