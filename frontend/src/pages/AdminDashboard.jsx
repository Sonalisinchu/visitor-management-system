import { useEffect, useState } from "react";
import api from "../services/api.js";
import DashboardShell, { EmptyState, ErrorState, LoadingState, StatCard, StatusBadge } from "../components/DashboardShell.jsx";

const AdminDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/visitors").then((res) => setVisitors(res.data)).catch(() => setError("We could not load visitor activity. Please try again.")).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.status === "checked_in").length,
    pending: visitors.filter((v) => v.status === "pending").length,
    completed: visitors.filter((v) => v.status === "checked_out").length,
  };

  return <DashboardShell eyebrow="Admin overview" title="Good morning, admin" description="A clear view of today’s visitor activity and building occupancy.">
    {error && <ErrorState message={error} />}
    {loading ? <LoadingState /> : <>
      <section aria-label="Visitor summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total visitors" value={stats.total} detail="All recorded visits" />
        <StatCard label="In building" value={stats.checkedIn} detail="Require attention at exit" />
        <StatCard label="Pending approvals" value={stats.pending} detail="Waiting for a host" />
        <StatCard label="Completed today" value={stats.completed} detail="Checked out visits" />
      </section>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-950">Recent visitor activity</h2><p className="mt-1 text-sm text-slate-500">Latest records across your workspace</p></div><span className="text-xs font-medium text-slate-400">{visitors.length} records</span></div>
        {visitors.length === 0 ? <div className="p-5"><EmptyState title="No visitor activity yet" description="New visits will appear here as they are created." /></div> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Visitor</th><th className="px-5 py-3 font-semibold">Purpose</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Visit date</th></tr></thead><tbody className="divide-y divide-slate-100">{visitors.slice(0, 8).map((v) => <tr key={v._id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">{v.name}</td><td className="px-5 py-4 text-slate-500">{v.purposeOfVisit || "—"}</td><td className="px-5 py-4"><StatusBadge status={v.status} /></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>}
      </section>
    </>}
  </DashboardShell>;
};

export default AdminDashboard;
