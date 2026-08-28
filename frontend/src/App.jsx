import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SecurityDesk from "./pages/SecurityDesk.jsx";
import HostDashboard from "./pages/HostDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const roleToPath = {
  admin: "/admin",
  security: "/security",
  host: "/host",
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Navigate to={user ? roleToPath[user.role] : "/login"} replace />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={["security", "admin"]}>
            <SecurityDesk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host"
        element={
          <ProtectedRoute allowedRoles={["host", "admin"]}>
            <HostDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
