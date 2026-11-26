import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, RequireRole, StatCard, StatusBadge, btnCls, btnOutline } from "@/components/Layout";
import { countBy, fmtDate, readFile, useStore, type Application, type Status } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Applications | Credential Recognition System" }, { name: "description", content: "Track the progress of your credential recognition applications." }, { property: "og:title", content: "My Applications | Credential Recognition System" }, { property: "og:description", content: "Track the progress of your credential recognition applications." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="applicant"><Dashboard /></RequireRole>,
});

const STEPS: Status[] = ["Pending", "Under Review", "Approved"];

function Dashboard() {
  const { apps, user } = useStore();
  const mine = apps.filter(a => a.userId === user!.id);
  const c = countBy(mine);
  return (
    <Page title={`Welcome, ${user!.name}`} subtitle="Submit applications and follow their progress." action={<Link to="/apply" className={btnCls}>+ New application</Link>}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total" value={c.total} />
        <StatCard label="Pending / In review" value={c.pending + c.review} tone="text-status-review" />
        <StatCard label="Approved" value={c.approved} tone="text-status-approved" />
        <StatCard label="Rejected" value={c.rejected} tone="text-destructive" />
      </div>
      <div className="mt-8 space-y-4">
        {mine.length === 0 && <Card><p className="text-muted-foreground">You have no applications yet. Click “New application” to start.</p></Card>}
        {mine.map(a => <AppCard key={a.id} a={a} />)}
      </div>
    </Page>
  );
}

function AppCard({ a }: { a: Application }) {
  const { update, addComment } = useStore();
  const [open, setOpen] = useState(false);
  const stepIndex = a.status === "Rejected" ? 2 : STEPS.indexOf(a.status);

  const uploadMore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const docs = await Promise.all(files.map(f => readFile(f, "Additional")));
    update(a.id, { docs: [...a.docs, ...docs], docsRequested: false });
    addComment(a.id, `Applicant uploaded ${docs.length} additional document(s).`);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{a.id} · Submitted {fmtDate(a.submittedAt)}</p>
          <h3 className="font-semibold text-primary">{a.qualification} in {a.course}</h3>
          <p className="text-sm text-muted-foreground">{a.institution}, {a.country} ({a.year})</p>
        </div>
        <StatusBadge status={a.status} />
      </div>
      {/* progress tracker */}
      <ol className="mt-4 grid grid-cols-3 gap-2 text-xs">
        {STEPS.map((s, i) => {
          const label = i === 2 && a.status === "Rejected" ? "Rejected" : s;
          const done = i <= stepIndex;
          return <li key={s} className={`rounded border-t-4 pt-1 ${done ? (label === "Rejected" ? "border-destructive text-destructive" : "border-primary text-primary") : "border-border text-muted-foreground"}`}>{label}</li>;
        })}
      </ol>
      {a.docsRequested && (
        <div className="mt-4 rounded-md border border-status-pending/40 bg-status-pending/10 p-3 text-sm">
          <p className="font-medium">Additional documents requested. Please upload them below.</p>
          <input type="file" multiple accept=".pdf,image/*" onChange={uploadMore} className="mt-2 text-sm" />
        </div>
      )}
      <button onClick={() => setOpen(!open)} className={btnOutline + " mt-4"}>{open ? "Hide details" : "View details"}</button>
      {open && (
        <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <h4 className="font-semibold">Documents</h4>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">{a.docs.map((d, i) => <li key={i}>{d.kind}: {d.name}</li>)}</ul>
          </div>
          <div>
            <h4 className="font-semibold">Reviewer comments</h4>
            {a.comments.length === 0 ? <p className="text-muted-foreground">No comments yet.</p> :
              <ul className="mt-1 space-y-2">{a.comments.map((c, i) => <li key={i} className="rounded bg-muted p-2"><p>{c.text}</p><p className="text-xs text-muted-foreground">{c.author} · {fmtDate(c.date)}</p></li>)}</ul>}
          </div>
        </div>
      )}
    </Card>
  );
}
