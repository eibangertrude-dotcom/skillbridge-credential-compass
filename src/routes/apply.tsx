import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, RequireRole, btnCls, inputCls } from "@/components/Layout";
import { readFile, useStore, type Doc } from "@/lib/store";

export const Route = createFileRoute("/apply")({
  head: () => ({ meta: [{ title: "New Application | CR, Legal & Financial Access" }, { name: "description", content: "Submit your qualification details and certificates for recognition." }, { property: "og:title", content: "New Application | CR, Legal & Financial Access" }, { property: "og:description", content: "Submit your qualification details and certificates for recognition." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="applicant"><Apply /></RequireRole>,
});

const QUALIFICATIONS = ["Certificate", "Diploma", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)", "Other"];

function Apply() {
  const { user, submit } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ fullName: user!.name, email: user!.email, phone: "", address: "", institution: "", qualification: "", course: "", year: "", country: "" });
  const [cert, setCert] = useState<File[]>([]);
  const [trans, setTrans] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const y = Number(f.year);
    if (y < 1950 || y > new Date().getFullYear()) return setError("Please enter a valid year of completion.");
    if (cert.length === 0) return setError("Please upload at least one academic certificate.");
    setBusy(true);
    const docs: Doc[] = [...await Promise.all(cert.map(x => readFile(x, "Certificate"))), ...await Promise.all(trans.map(x => readFile(x, "Transcript")))];
    submit({ ...f, docs });
    nav({ to: "/dashboard" });
  };

  const field = (label: string, k: keyof typeof f, type = "text") => (
    <label className="block text-sm font-medium">{label}<input type={type} required className={inputCls + " mt-1"} value={f[k]} onChange={set(k)} /></label>
  );

  return (
    <Page title="New recognition application" subtitle="All fields are required unless marked optional.">
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <h2 className="mb-4 font-semibold text-primary">Personal & contact details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {field("Full name", "fullName")}
            {field("Email", "email", "email")}
            {field("Phone number", "phone", "tel")}
            {field("Postal address", "address")}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold text-primary">Qualification details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {field("Institution attended", "institution")}
            <label className="block text-sm font-medium">Qualification obtained
              <select required className={inputCls + " mt-1"} value={f.qualification} onChange={set("qualification")}>
                <option value="">Select…</option>{QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
              </select>
            </label>
            {field("Course / programme studied", "course")}
            {field("Year of completion", "year", "number")}
            {field("Country of institution", "country")}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold text-primary">Documents</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">Academic certificate(s)
              <input type="file" multiple accept=".pdf,image/*" className="mt-1 block w-full text-sm" onChange={e => setCert(Array.from(e.target.files ?? []))} />
            </label>
            <label className="block text-sm font-medium">Transcript(s) <span className="text-muted-foreground">(optional)</span>
              <input type="file" multiple accept=".pdf,image/*" className="mt-1 block w-full text-sm" onChange={e => setTrans(Array.from(e.target.files ?? []))} />
            </label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">PDF or image files. Files under 1.5 MB can be previewed by reviewers.</p>
        </Card>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={busy} className={btnCls}>{busy ? "Submitting…" : "Submit application"}</button>
      </form>
    </Page>
  );
}
