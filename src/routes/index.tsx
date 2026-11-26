import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, btnCls, btnOutline } from "@/components/Layout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home | Credential Recognition System" }, { name: "description", content: "Get your academic qualifications recognised: apply online, upload certificates and track your verification." }, { property: "og:title", content: "Home | Credential Recognition System" }, { property: "og:description", content: "Get your academic qualifications recognised: apply online, upload certificates and track your verification." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
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
  return (
    <main>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SDG 4 & 8 · Proving skills without paper records</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold text-primary md:text-5xl">Have your academic credentials recognised — fairly and transparently.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">The Credential Recognition System lets applicants submit qualifications earned anywhere in the world, and lets our institution review, verify and decide on them in one place.</p>
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
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-2xl font-bold text-primary">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d]) => <Card key={t}><h3 className="font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>)}
        </div>
        <Card className="mt-8 bg-secondary">
          <h3 className="font-semibold text-primary">Why it matters</h3>
          <p className="mt-2 text-sm text-muted-foreground">Many people — including refugees and migrants — hold real qualifications but lack recognised paper records. Recognition opens doors to further study (SDG 4) and decent work (SDG 8). Where records are incomplete, assessors can request additional evidence or recommend bridging certification.</p>
        </Card>
      </section>
    </main>
  );
}
