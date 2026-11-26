import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Page, RequireRole, StatusBadge, btnCls, btnOutline } from "@/components/Layout";
import { fmtDate, useStore } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "My Requests | CR, Legal & Financial Access" }, { name: "description", content: "Track your legal and financial assistance requests." }, { property: "og:title", content: "My Requests | CR, Legal & Financial Access" }, { property: "og:description", content: "Track your legal and financial assistance requests." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="applicant"><Track /></RequireRole>,
});

function Track() {
  const { requests, user } = useStore();
  const mine = requests.filter(r => r.userId === user!.id);
  return (
    <Page title="My Legal & Financial Requests" subtitle="Check whether each request is Pending, Under Review, Approved or Rejected."
      action={<div className="flex gap-2"><Link to="/legal-request" className={btnOutline}>Legal request</Link><Link to="/financial-apply" className={btnCls}>Financial application</Link></div>}>
      <div className="space-y-4">
        {mine.length === 0 && <Card><p className="text-muted-foreground">You have no requests yet.</p></Card>}
        {mine.map(r => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{r.id} · {r.type} · Submitted {fmtDate(r.submittedAt)}</p>
                <h3 className="font-semibold text-primary">{r.category}{r.amount ? ` – $${r.amount.toLocaleString()}` : ""}</h3>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.comments.length > 0 && <ul className="mt-3 space-y-2 text-sm">{r.comments.map((c, i) => <li key={i} className="rounded bg-muted p-2">{c.text}<span className="block text-xs text-muted-foreground">{c.author} · {fmtDate(c.date)}</span></li>)}</ul>}
          </Card>
        ))}
      </div>
    </Page>
  );
}
