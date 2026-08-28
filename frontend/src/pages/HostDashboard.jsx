import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const HostDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const { logout } = useAuth();

  const load = async () => {
    const { data } = await api.get("/visitors");
    setVisitors(data);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, action) => {
    await api.patch(`/visitors/${id}/${action}`);
    load();
  };

  const pending = visitors.filter((v) => v.status === "pending");
  const others = visitors.filter((v) => v.status !== "pending");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Host Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>

      <h2 className="font-semibold mb-2">Pending Approvals ({pending.length})</h2>
      <div className="space-y-2 mb-8">
        {pending.map((v) => (
          <div key={v._id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{v.name}</p>
              <p className="text-xs text-gray-500">{v.purposeOfVisit}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => decide(v._id, "approve")} className="bg-green-600 text-white text-xs px-3 py-1 rounded">
                Approve
              </button>
              <button onClick={() => decide(v._id, "reject")} className="bg-red-600 text-white text-xs px-3 py-1 rounded">
                Reject
              </button>
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="text-sm text-gray-500">No pending requests.</p>}
      </div>

      <h2 className="font-semibold mb-2">History</h2>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {others.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="p-2">{v.name}</td>
              <td className="p-2">{v.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HostDashboard;
