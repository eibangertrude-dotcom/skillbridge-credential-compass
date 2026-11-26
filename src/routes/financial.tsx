import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Page, btnCls } from "@/components/Layout";

export const Route = createFileRoute("/financial")({
  head: () => ({ meta: [{ title: "Financial Assistance | CR, Legal & Financial Access" }, { name: "description", content: "Available financial support, eligibility, guidelines and deadlines." }, { property: "og:title", content: "Financial Assistance | CR, Legal & Financial Access" }, { property: "og:description", content: "Available financial support, eligibility, guidelines and deadlines." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Financial,
});

const OPPS = [
  { name: "Bridging Certification Grant", max: "Up to $1,000", deadline: "31 Jan 2027", who: "Applicants whose credentials need a bridging course to be fully recognised." },
  { name: "Education Bursary", max: "Up to $2,500", deadline: "15 Mar 2027", who: "Students enrolled or accepted at a recognised institution with household income below the threshold." },
  { name: "Emergency Hardship Fund", max: "Up to $1,000", deadline: "Open all year", who: "People facing sudden hardship such as job loss, eviction or medical costs." },
  { name: "Small Business Start-up Loan", max: "Up to $5,000 (0% interest)", deadline: "30 Jun 2027", who: "Adults with a simple business plan and proven skills in their trade." },
];

function Financial() {
  return (
    <Page title="Financial Assistance" subtitle="Support opportunities to help you study, certify and work." action={<Link to="/financial-apply" className={btnCls}>Apply for assistance</Link>}>
      <div className="grid gap-4 md:grid-cols-2">
        {OPPS.map(o => (
          <Card key={o.name}>
            <h3 className="font-semibold text-primary">{o.name}</h3>
            <p className="mt-1 text-sm"><strong>Amount:</strong> {o.max}</p>
            <p className="text-sm"><strong>Deadline:</strong> {o.deadline}</p>
            <p className="mt-2 text-sm text-muted-foreground"><strong>Eligibility:</strong> {o.who}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 bg-secondary">
        <h2 className="font-semibold text-primary">Application guidelines</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Register or log in as an applicant.</li>
          <li>Choose one programme and state the amount you need.</li>
          <li>Explain your situation honestly and upload proof (ID, income, quotes or bills).</li>
          <li>Track your application under “My Requests”. Decisions are usually made within 14 days.</li>
        </ol>
      </Card>
    </Page>
  );
}
