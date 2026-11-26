import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, btnCls, btnOutline } from "@/components/Layout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home | CR, Legal & Financial Access" }, { name: "description", content: "Get your academic qualifications recognised: apply online, upload certificates and track your verification." }, { property: "og:title", content: "Home | CR, Legal & Financial Access" }, { property: "og:description", content: "Get your academic qualifications recognised: apply online, upload certificates and track your verification." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Home,
});

function Home() {
  const { user } = useStore();
  const steps = [
    ["1. Register", "Create a free applicant account in under a minute."],
    ["2. Apply", "Enter your qualification details and upload certificates and transcripts."],
    ["3. Review", "Our assessors verify your documents and may request more information."],
    ["4. Decision", "Track your status online until your credential is approved."],
  ];
  const audience = [
    ["Refugees & migrants", "People whose certificates and transcripts were left behind, damaged or never issued."],
    ["Graduates with foreign degrees", "Anyone who needs a qualification earned abroad checked and recognised locally."],
    ["Workers needing bridging courses", "Skilled adults who must complete a short certification to practise their trade."],
    ["People facing legal or money barriers", "Those who need to know their rights, or funding to finish the recognition process."],
  ];
  const aidSteps = [
    ["Tell us your situation", "Fill in a short request form: the type of issue, what happened and any supporting documents."],
    ["We review it", "A volunteer adviser or funding officer reads your request and may ask for more proof."],
    ["You get support", "You receive free legal guidance, a referral to a legal aid clinic, or a decision on your funding."],
  ];
  const programmes = [
    ["Bridging Certification Grant", "Up to $1,000", "31 Jan 2027", "For applicants whose credentials need a bridging course."],
    ["Education Bursary", "Up to $2,500", "15 Mar 2027", "For students enrolled or accepted at a recognised institution."],
    ["Emergency Hardship Fund", "Up to $1,000", "Open all year", "For sudden hardship such as job loss, eviction or medical costs."],
    ["Small Business Start-up Loan", "Up to $5,000", "30 Jun 2027", "0% interest, for adults with a simple business plan and proven skills."],
  ];
  const faq = [
    ["Do I need original certificates to apply?", "No. Upload scans or photos of whatever you have. If records are incomplete, assessors can request additional evidence or recommend bridging certification."],
    ["Is it free to use the platform?", "Yes. Registering, submitting applications and requesting legal assistance cost nothing."],
    ["How long does a decision take?", "Credential checks usually take 3–4 weeks. Legal requests are reviewed in 5–10 working days and funding decisions within about 14 days."],
    ["Can I track my application after submitting it?", "Yes. Log in and open My Applications or My Requests to see the status and any message from an administrator."],
    ["Is my personal information safe?", "Your details are only visible to authorised administrators reviewing your case."],
  ];
  return (
    <main>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SDG 4 & 8 · Proving skills without paper records</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold text-primary md:text-5xl">One platform for credential recognition, legal help and financial support.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Get qualifications earned anywhere recognised, understand your rights, and access funding for bridging certifications — all with one account.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className={btnCls}>Go to my dashboard</Link>
            ) : (
              <>
                <Link to="/register" className={btnCls}>Start an application</Link>
                <Link to="/login" className={btnOutline}>Log in / Try demo</Link>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="font-serif text-2xl font-bold text-primary">Our services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-serif text-xl font-bold text-primary">Credential Recognition</h3>
            <p className="mt-2 text-sm text-muted-foreground">Submit your qualifications and documents, get them verified and track the decision.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Link to="/apply" className={btnCls}>Apply for recognition</Link><Link to="/dashboard" className={btnOutline}>Track applications</Link></div>
          </Card>
          <Card>
            <h3 className="font-serif text-xl font-bold text-primary">Legal & Financial Access</h3>
            <p className="mt-2 text-sm text-muted-foreground">Learn your rights, request free legal assistance, and apply for grants, bursaries and hardship support.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Link to="/legal" className={btnCls}>Legal information</Link><Link to="/financial" className={btnOutline}>Financial assistance</Link><Link to="/track" className={btnOutline}>Track requests</Link></div>
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-2xl font-bold text-primary">How credential recognition works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d]) => <Card key={t}><h3 className="font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>)}
        </div>
        <Card className="mt-8 bg-secondary">
          <h3 className="font-semibold text-primary">Why it matters</h3>
          <p className="mt-2 text-sm text-muted-foreground">Many people — including refugees and migrants — hold real qualifications but lack recognised paper records. Recognition opens doors to further study (SDG 4) and decent work (SDG 8). Where records are incomplete, assessors can request additional evidence or recommend bridging certification.</p>
        </Card>
      </section>
      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary">Who this platform is for</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">If you can prove what you know but cannot show a recognised document, start here.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audience.map(([t, d]) => <Card key={t}><h3 className="font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-2xl font-bold text-primary">How legal & financial access works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {aidSteps.map(([t, d], i) => <Card key={t}><p className="text-sm font-semibold text-muted-foreground">Step {i + 1}</p><h3 className="mt-1 font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/legal-request" className={btnCls}>Request legal assistance</Link>
          <Link to="/financial-apply" className={btnOutline}>Apply for financial assistance</Link>
          <Link to="/legal" className={btnOutline}>Know your rights</Link>
        </div>
      </section>
      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary">Financial support at a glance</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Four programmes help people finish certification, keep studying, or get back on their feet.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map(([name, amount, deadline, who]) => (
              <Card key={name}>
                <h3 className="font-semibold text-primary">{name}</h3>
                <p className="mt-2 text-sm"><strong>{amount}</strong></p>
                <p className="text-sm text-muted-foreground">Deadline: {deadline}</p>
                <p className="mt-2 text-sm text-muted-foreground">{who}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm"><Link to="/financial" className="font-medium text-primary underline underline-offset-4">See eligibility rules and how to apply</Link></p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-2xl font-bold text-primary">Common questions</h2>
        <Card className="mt-6 divide-y">
          {faq.map(([q, a]) => <details key={q} className="py-3"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted-foreground">{a}</p></details>)}
        </Card>
        <p className="mt-4 text-xs text-muted-foreground">General guidance only — not formal legal advice.</p>
      </section>
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary">Ready to get started?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Create one free account to apply for recognition, ask for legal help and request funding.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className={btnCls}>Go to my dashboard</Link>
            ) : (
              <>
                <Link to="/register" className={btnCls}>Create an account</Link>
                <Link to="/apply" className={btnOutline}>Apply for recognition</Link>
                <Link to="/financial-apply" className={btnOutline}>Apply for funding</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
