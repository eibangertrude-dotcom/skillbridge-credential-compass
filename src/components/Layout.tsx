import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useStore, type Status } from "@/lib/store";

export function Header() {
  const { user, logout } = useStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    ...(user?.role === "applicant" ? [{ to: "/dashboard", label: "My Applications" }, { to: "/apply", label: "New Application" }] : []),
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Applications" }, { to: "/reports", label: "Reports" }] : []),
  ] as const;
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-lg font-bold">Credential Recognition System</Link>
        <button className="md:hidden rounded border border-primary-foreground/40 px-2 py-1 text-sm" onClick={() => setOpen(!open)}>Menu</button>
        <nav className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-14 z-10 flex-col gap-1 bg-primary p-4 md:static md:flex md:flex-row md:items-center md:gap-5 md:p-0`}>
          {links.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm opacity-90 hover:opacity-100" activeProps={{ className: "font-semibold underline underline-offset-4" }} activeOptions={{ exact: true }}>{l.label}</Link>)}
          {user ? (
            <>
              <span className="text-xs opacity-75">{user.name} ({user.role})</span>
              <button onClick={() => { logout(); nav({ to: "/" }); }} className="rounded bg-primary-foreground px-3 py-1 text-sm font-medium text-primary">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Log in</Link>
              <Link to="/register" className="rounded bg-primary-foreground px-3 py-1 text-sm font-medium text-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Page({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </main>
  );
}

const statusStyle: Record<Status, string> = {
  Pending: "bg-status-pending/15 text-status-pending",
  "Under Review": "bg-status-review/15 text-status-review",
  Approved: "bg-status-approved/15 text-status-approved",
  Rejected: "bg-destructive/15 text-destructive",
};
export function StatusBadge({ status }: { status: Status }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[status]}`}>{status}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-card p-5 shadow-sm ${className}`}>{children}</div>;
}

export const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export const btnCls = "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50";
export const btnOutline = "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted";

export function RequireRole({ role, children }: { role: "applicant" | "admin"; children: ReactNode }) {
  const { user, ready } = useStore();
  if (!ready) return <p className="p-8 text-center text-muted-foreground">Loading…</p>;
  if (!user || user.role !== role)
    return (
      <Page title="Please log in" subtitle={`This page is for ${role === "admin" ? "administrators" : "applicants"}.`}>
        <Link to="/login" className={btnCls}>Go to login</Link>
      </Page>
    );
  return <>{children}</>;
}

export function StatCard({ label, value, tone = "text-primary" }: { label: string; value: number; tone?: string }) {
  return <Card><p className="text-sm text-muted-foreground">{label}</p><p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p></Card>;
}
