import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, RequireRole, StatusBadge, btnCls, btnOutline, inputCls } from "@/components/Layout";
import { fmtDate, useStore, type Doc, type Status } from "@/lib/store";

export const Route = createFileRoute("/review/$id")({
  head: () => ({ meta: [{ title: "Review Application | CR, Legal & Financial Access" }, { name: "description", content: "Examine documents and decide on a credential recognition application." }, { property: "og:title", content: "Review Application | CR, Legal & Financial Access" }, { property: "og:description", content: "Examine documents and decide on a credential recognition application." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="admin"><Review /></RequireRole>,
});

function Review() {
  const { id } = Route.useParams();
  const { apps, update, addComment } = useStore();
  const a = apps.find(x => x.id === id);
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState<Doc | null>(null);
  const [msg, setMsg] = useState("");

  if (!a) return <Page title="Application not found"><Link to="/admin" className={btnCls}>Back to applications</Link></Page>;

  const act = (status: Status, note: string, docsRequested = false) => {
    update(a.id, { status, docsRequested });
    addComment(a.id, comment.trim() ? `${note} — ${comment.trim()}` : note);
    setComment("");
    setMsg(`Application marked as ${status}.`);
  };

  const rows: [string, string][] = [["Full name", a.fullName], ["Email", a.email], ["Phone", a.phone], ["Address", a.address], ["Institution", a.institution], ["Qualification", a.qualification], ["Course", a.course], ["Year of completion", a.year], ["Country", a.country], ["Submitted", fmtDate(a.submittedAt)]];

  return (
    <Page title={`Application ${a.id}`} subtitle={a.fullName} action={<Link to="/admin" className={btnOutline}>← All applications</Link>}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-primary">Applicant details</h2><StatusBadge status={a.status} /></div>
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {rows.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold text-primary">Submitted documents</h2>
            <ul className="divide-y text-sm">
              {a.docs.map((d, i) => (
                <li key={i} className="flex items-center justify-between gap-2 py-2">
                  <span><span className="text-muted-foreground">{d.kind}:</span> {d.name} <span className="text-xs text-muted-foreground">({Math.round(d.size / 1024)} KB)</span></span>
                  <button className="text-primary underline" onClick={() => setPreview(d)}>Examine</button>
                </li>
              ))}
            </ul>
            {preview && (
              <div className="mt-4 rounded-md border bg-muted p-3">
                <div className="mb-2 flex justify-between text-sm"><strong>{preview.name}</strong><button onClick={() => setPreview(null)} className="underline">Close</button></div>
                {!preview.url ? <p className="text-sm text-muted-foreground">Sample document — no file preview available in demo data.</p>
                  : preview.type.startsWith("image/") ? <img src={preview.url} alt={preview.name} className="max-h-[500px] w-full object-contain" />
                  : <iframe src={preview.url} title={preview.name} className="h-[500px] w-full bg-card" />}
              </div>
            )}
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold text-primary">Comments & history</h2>
            {a.comments.length === 0 ? <p className="text-sm text-muted-foreground">No comments yet.</p> :
              <ul className="space-y-2 text-sm">{a.comments.map((c, i) => <li key={i} className="rounded bg-muted p-2"><p>{c.text}</p><p className="text-xs text-muted-foreground">{c.author} · {fmtDate(c.date)}</p></li>)}</ul>}
          </Card>
        </div>
        <Card className="h-fit space-y-3">
          <h2 className="font-semibold text-primary">Review decision</h2>
          <textarea rows={4} placeholder="Add a comment for the applicant (optional)…" className={inputCls} value={comment} onChange={e => setComment(e.target.value)} />
          <button className={btnOutline + " w-full"} disabled={!comment.trim()} onClick={() => { addComment(a.id, comment.trim()); setComment(""); setMsg("Comment added."); }}>Add comment only</button>
          <button className={btnOutline + " w-full"} onClick={() => act("Under Review", "Marked as under review")}>Mark as Under Review</button>
          <button className={btnOutline + " w-full"} onClick={() => act("Under Review", "Additional documents requested", true)}>Request additional documents</button>
          <button className="w-full rounded-md bg-status-approved px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90" onClick={() => act("Approved", "Application approved")}>Approve</button>
          <button className="w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90" onClick={() => act("Rejected", "Application rejected")}>Reject</button>
          {msg && <p className="text-sm text-status-approved">{msg}</p>}
        </Card>
      </div>
    </Page>
  );
}
