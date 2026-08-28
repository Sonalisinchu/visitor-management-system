import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/visitors").then((res) => setVisitors(res.data));
  }, []);

  const stats = {
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.status === "checked_in").length,
    pending: visitors.filter((v) => v.status === "pending").length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded p-4">
          <p className="text-sm text-gray-500">Total Visitors</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-white border rounded p-4">
          <p className="text-sm text-gray-500">Currently In Building</p>
          <p className="text-2xl font-semibold">{stats.checkedIn}</p>
        </div>
        <div className="bg-white border rounded p-4">
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <p className="text-2xl font-semibold">{stats.pending}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Hook up /api/reports/summary here for real charts, and /api/users for user management.
      </p>
    </div>
  );
};

export default AdminDashboard;
