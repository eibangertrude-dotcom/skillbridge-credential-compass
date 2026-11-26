import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, RequireRole, StatusBadge, inputCls } from "@/components/Layout";
import { fmtDate, useStore, type Status } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Applications | Credential Recognition System" }, { name: "description", content: "Administrator view of all credential recognition applications." }, { property: "og:title", content: "Applications | Credential Recognition System" }, { property: "og:description", content: "Administrator view of all credential recognition applications." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="admin"><Admin /></RequireRole>,
});

const FILTERS: ("All" | Status)[] = ["All", "Pending", "Under Review", "Approved", "Rejected"];

function Admin() {
  const { apps } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("All");
  const term = q.toLowerCase();
  const list = apps.filter(a =>
    (status === "All" || a.status === status) &&
    [a.id, a.fullName, a.institution, a.course, a.country].some(v => v.toLowerCase().includes(term)));

  return (
    <Page title="Applications" subtitle={`${apps.length} applications received`}>
      <Card className="mb-4 flex flex-col gap-3 md:flex-row">
        <input placeholder="Search by name, ID, institution, course or country…" className={inputCls} value={q} onChange={e => setQ(e.target.value)} />
        <select className={inputCls + " md:w-48"} value={status} onChange={e => setStatus(e.target.value as Status)}>
          {FILTERS.map(s => <option key={s}>{s}</option>)}
        </select>
      </Card>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-primary">
            <tr>{["ID", "Applicant", "Qualification", "Institution", "Submitted", "Status", ""].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                <td className="px-4 py-3">{a.fullName}{a.docsRequested && <span className="block text-xs text-status-pending">Awaiting documents</span>}</td>
                <td className="px-4 py-3">{a.qualification} – {a.course}</td>
                <td className="px-4 py-3">{a.institution}, {a.country}</td>
                <td className="px-4 py-3 whitespace-nowrap">{fmtDate(a.submittedAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3"><Link to="/review/$id" params={{ id: a.id }} className="font-medium text-primary underline">Review</Link></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No applications match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
