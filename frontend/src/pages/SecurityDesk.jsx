import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const SecurityDesk = () => {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", purposeOfVisit: "", hostId: "" });
  const { logout } = useAuth();

  const loadVisitors = async () => {
    const { data } = await api.get("/visitors");
    setVisitors(data);
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    await api.post("/visitors/checkin", form);
    setForm({ name: "", phone: "", purposeOfVisit: "", hostId: "" });
    loadVisitors();
  };

  const handleCheckout = async (id) => {
    await api.patch(`/visitors/${id}/checkout`);
    loadVisitors();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Security Desk</h1>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>

      <form onSubmit={handleCheckIn} className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
        <input className="border rounded px-3 py-2" placeholder="Visitor Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border rounded px-3 py-2" placeholder="Phone"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="border rounded px-3 py-2" placeholder="Purpose of Visit"
          value={form.purposeOfVisit} onChange={(e) => setForm({ ...form, purposeOfVisit: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Host ID (Mongo _id for now)"
          value={form.hostId} onChange={(e) => setForm({ ...form, hostId: e.target.value })} required />
        <button className="col-span-2 bg-blue-600 text-white rounded py-2">Check In Visitor</button>
      </form>

      <h2 className="font-semibold mb-2">All Visitors</h2>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Check-in</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="p-2">{v.name}</td>
              <td className="p-2">{v.status}</td>
              <td className="p-2">{v.checkInTime ? new Date(v.checkInTime).toLocaleString() : "-"}</td>
              <td className="p-2">
                {v.status === "checked_in" && (
                  <button onClick={() => handleCheckout(v._id)} className="text-blue-600 text-xs">
                    Check Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityDesk;
