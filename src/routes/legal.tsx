import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Page, btnCls } from "@/components/Layout";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title: "Legal Information | CR, Legal & Financial Access" }, { name: "description", content: "Basic legal guidance, your rights and frequently asked questions." }, { property: "og:title", content: "Legal Information | CR, Legal & Financial Access" }, { property: "og:description", content: "Basic legal guidance, your rights and frequently asked questions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Legal,
});

const RIGHTS = [
  ["Right to fair work", "You must be paid agreed wages on time and work in safe conditions, whatever your nationality."],
  ["Right to housing protection", "A landlord must give proper written notice before eviction and cannot keep your deposit without reason."],
  ["Right to non-discrimination", "You cannot be refused work, study or services because of race, religion, gender or origin."],
  ["Right to legal advice", "You may seek free legal advice and an interpreter when dealing with authorities."],
];
const FAQ = [
  ["Is legal assistance free?", "Yes. Requests are reviewed by volunteer advisers and partner legal aid clinics at no cost."],
  ["What documents should I attach?", "Anything related to your issue: contracts, letters, notices, receipts or ID documents."],
  ["How long does a review take?", "Most requests are reviewed within 5–10 working days. Track progress under My Requests."],
  ["Is my information confidential?", "Yes. Only authorised administrators can see your request."],
];

function Legal() {
  return (
    <Page title="Legal Information" subtitle="Basic guidance to help you understand your rights." action={<Link to="/legal-request" className={btnCls}>Request legal assistance</Link>}>
      <h2 className="mb-3 font-serif text-xl font-bold text-primary">Know your rights</h2>
      <div className="grid gap-4 md:grid-cols-2">{RIGHTS.map(([t, d]) => <Card key={t}><h3 className="font-semibold text-primary">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></Card>)}</div>
      <h2 className="mb-3 mt-8 font-serif text-xl font-bold text-primary">Frequently asked questions</h2>
      <Card className="divide-y">{FAQ.map(([q, a]) => <details key={q} className="py-3"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted-foreground">{a}</p></details>)}</Card>
      <p className="mt-6 text-xs text-muted-foreground">This information is general guidance, not formal legal advice.</p>
    </Page>
  );
}
