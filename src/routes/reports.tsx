import { createFileRoute } from "@tanstack/react-router";
import { Card, Page, RequireRole, StatCard, btnOutline } from "@/components/Layout";
import { countBy, useStore } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports | Credential Recognition System" }, { name: "description", content: "Summary of credential recognition applications by status." }, { property: "og:title", content: "Reports | Credential Recognition System" }, { property: "og:description", content: "Summary of credential recognition applications by status." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="admin"><Reports /></RequireRole>,
});

function Reports() {
  const { apps, reset } = useStore();
  const c = countBy(apps);
  const bars = [
    { label: "Pending", value: c.pending, cls: "bg-status-pending" },
    { label: "Under Review", value: c.review, cls: "bg-status-review" },
    { label: "Approved", value: c.approved, cls: "bg-status-approved" },
    { label: "Rejected", value: c.rejected, cls: "bg-destructive" },
  ];
  const byCountry = Object.entries(apps.reduce<Record<string, number>>((m, a) => ({ ...m, [a.country]: (m[a.country] ?? 0) + 1 }), {})).sort((x, y) => y[1] - x[1]);

  return (
    <Page title="Reports" subtitle="Overview of all applications."
      action={<button className={btnOutline} onClick={() => confirm("Reset all data to the original sample data?") && reset()}>Reset demo data</button>}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total applications" value={c.total} />
        <StatCard label="Pending" value={c.pending} tone="text-status-pending" />
        <StatCard label="Under review" value={c.review} tone="text-status-review" />
        <StatCard label="Approved" value={c.approved} tone="text-status-approved" />
        <StatCard label="Rejected" value={c.rejected} tone="text-destructive" />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-primary">Applications by status</h2>
          <div className="space-y-3">
            {bars.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm"><span>{b.label}</span><span>{b.value} ({c.total ? Math.round(b.value / c.total * 100) : 0}%)</span></div>
                <div className="mt-1 h-3 rounded bg-muted"><div className={`h-3 rounded ${b.cls}`} style={{ width: `${c.total ? b.value / c.total * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold text-primary">Applications by country</h2>
          <ul className="divide-y text-sm">{byCountry.map(([k, v]) => <li key={k} className="flex justify-between py-2"><span>{k}</span><strong>{v}</strong></li>)}</ul>
        </Card>
      </div>
    </Page>
  );
}
