import { useAuth } from "../context/AuthContext.jsx";

const roleLabels = {
  admin: "Administrator",
  host: "Host coordinator",
  security: "Security desk",
};

const DashboardShell = ({ title, eyebrow, description, children, actions }) => {
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : "V";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">VM</div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Visitor Management</p>
              <p className="text-xs text-slate-500">Operations console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name || user?.email || "Team member"}</p>
              <p className="text-xs text-slate-500">{roleLabels[user?.role] || "Staff"}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800" aria-hidden="true">{initials}</div>
            <button onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardShell;

export const StatusBadge = ({ status }) => {
  const labels = { pending: "Pending", approved: "Approved", rejected: "Rejected", checked_in: "Checked in", checked_out: "Checked out" };
  const tone = { pending: "bg-amber-50 text-amber-700 ring-amber-600/20", approved: "bg-blue-50 text-blue-700 ring-blue-600/20", rejected: "bg-rose-50 text-rose-700 ring-rose-600/20", checked_in: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", checked_out: "bg-slate-100 text-slate-600 ring-slate-500/20" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone[status] || tone.pending}`}>{labels[status] || status}</span>;
};

export const StatCard = ({ label, value, detail }) => <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>;

export const EmptyState = ({ title, description }) => <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center"><p className="font-medium text-slate-800">{title}</p><p className="mt-1 text-sm text-slate-500">{description}</p></div>;

export const ErrorState = ({ message }) => <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>;

export const LoadingState = () => <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">Loading visitor activity...</div>;
