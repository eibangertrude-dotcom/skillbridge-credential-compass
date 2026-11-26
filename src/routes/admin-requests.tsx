import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, RequireRole, StatCard, StatusBadge, btnCls, btnOutline, inputCls } from "@/components/Layout";
import { countBy, fmtDate, useStore, type AidRequest, type Status } from "@/lib/store";

export const Route = createFileRoute("/admin-requests")({
  head: () => ({ meta: [{ title: "Legal & Financial Requests | CR, Legal & Financial Access" }, { name: "description", content: "Administrator dashboard for legal and financial assistance requests." }, { property: "og:title", content: "Legal & Financial Requests | CR, Legal & Financial Access" }, { property: "og:description", content: "Administrator dashboard for legal and financial assistance requests." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="admin"><AdminRequests /></RequireRole>,
});

const STATUSES: Status[] = ["Pending", "Under Review", "Approved", "Rejected"];

function AdminRequests() {
  const { requests } = useStore();
  const [type, setType] = useState<"All" | "Legal" | "Financial">("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [q, setQ] = useState("");
  const list = requests.filter(r => (type === "All" || r.type === type) && (status === "All" || r.status === status) &&
    [r.id, r.fullName, r.category].some(v => v.toLowerCase().includes(q.toLowerCase())));
  const legal = countBy(requests.filter(r => r.type === "Legal"));
  const fin = requests.filter(r => r.type === "Financial");
  const approvedAmount = fin.filter(r => r.status === "Approved").reduce((s, r) => s + (r.amount ?? 0), 0);
  return (
    <Page title="Legal & Financial Requests" subtitle={`${requests.length} requests received`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Legal requests" value={legal.total} />
        <StatCard label="Financial applications" value={fin.length} />
        <StatCard label="Pending / In review" value={countBy(requests).pending + countBy(requests).review} tone="text-status-review" />
        <StatCard label="Approved funding (USD)" value={approvedAmount} tone="text-status-approved" />
      </div>
      <Card className="my-4 flex flex-col gap-3 md:flex-row">
        <input placeholder="Search by name, ID or category…" className={inputCls} value={q} onChange={e => setQ(e.target.value)} />
        <select className={inputCls + " md:w-40"} value={type} onChange={e => setType(e.target.value as typeof type)}>{["All", "Legal", "Financial"].map(s => <option key={s}>{s}</option>)}</select>
        <select className={inputCls + " md:w-44"} value={status} onChange={e => setStatus(e.target.value as typeof status)}>{["All", ...STATUSES].map(s => <option key={s}>{s}</option>)}</select>
      </Card>
      <div className="space-y-4">
        {list.length === 0 && <Card><p className="text-center text-muted-foreground">No requests match your search.</p></Card>}
        {list.map(r => <RequestRow key={r.id} r={r} />)}
      </div>
    </Page>
  );
}

function RequestRow({ r }: { r: AidRequest }) {
  const { updateRequest, commentRequest } = useStore();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{r.id} · {r.type} · {fmtDate(r.submittedAt)}</p>
          <h3 className="font-semibold text-primary">{r.fullName} – {r.category}{r.amount ? ` ($${r.amount.toLocaleString()})` : ""}</h3>
        </div>
        <StatusBadge status={r.status} />
      </div>
      <button className={btnOutline + " mt-3"} onClick={() => setOpen(!open)}>{open ? "Close" : "Review"}</button>
      {open && (
        <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <p><strong>Email:</strong> {r.email}</p><p><strong>Phone:</strong> {r.phone}</p>
            <p><strong>Description:</strong> {r.description}</p>
            <p className="font-semibold">Documents</p>
            {r.docs.length === 0 ? <p className="text-muted-foreground">None uploaded.</p> :
              <ul className="list-disc pl-5">{r.docs.map((d, i) => <li key={i}>{d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="text-primary underline">{d.name}</a> : d.name}</li>)}</ul>}
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">{STATUSES.map(s => <button key={s} className={s === r.status ? btnCls : btnOutline} onClick={() => updateRequest(r.id, { status: s })}>{s}</button>)}</div>
            <textarea rows={3} className={inputCls} placeholder="Feedback for the applicant…" value={note} onChange={e => setNote(e.target.value)} />
            <button className={btnCls} disabled={!note.trim()} onClick={() => { commentRequest(r.id, note.trim()); setNote(""); }}>Send feedback</button>
            {r.comments.map((c, i) => <p key={i} className="rounded bg-muted p-2">{c.text}<span className="block text-xs text-muted-foreground">{c.author} · {fmtDate(c.date)}</span></p>)}
          </div>
        </div>
      )}
    </Card>
  );
}
