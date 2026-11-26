import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, btnCls, inputCls } from "@/components/Layout";
import { readFile, useStore, type ReqType } from "@/lib/store";

export const LEGAL_ISSUES = ["Employment", "Housing / Tenancy", "Immigration / Residence", "Family", "Discrimination", "Other"];
export const FIN_PROGRAMMES = ["Bridging Certification Grant", "Education Bursary", "Emergency Hardship Fund", "Small Business Start-up Loan"];

/** Shared form for Legal Assistance Requests and Financial Assistance Applications. */
export function RequestForm({ type }: { type: ReqType }) {
  const { user, submitRequest } = useStore();
  const nav = useNavigate();
  const legal = type === "Legal";
  const [f, setF] = useState({ fullName: user?.name ?? "", email: user?.email ?? "", phone: "", category: legal ? LEGAL_ISSUES[0]! : FIN_PROGRAMMES[0]!, description: "", amount: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.fullName || !f.email || !f.phone || f.description.length < 10) return setError("Please fill in all fields (description at least 10 characters).");
    if (!legal && !(Number(f.amount) > 0)) return setError("Please enter the amount requested.");
    const docs = await Promise.all(files.map(x => readFile(x, "Additional")));
    const id = submitRequest({ type, fullName: f.fullName, email: f.email, phone: f.phone, category: f.category, description: f.description, docs, ...(legal ? {} : { amount: Number(f.amount) }) });
    alert(`Submitted! Your reference number is ${id}.`);
    nav({ to: "/track" });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">Full name<input className={inputCls} value={f.fullName} onChange={set("fullName")} /></label>
        <label className="text-sm">Email<input type="email" className={inputCls} value={f.email} onChange={set("email")} /></label>
        <label className="text-sm">Phone<input className={inputCls} value={f.phone} onChange={set("phone")} /></label>
        <label className="text-sm">{legal ? "Type of legal issue" : "Support programme"}
          <select className={inputCls} value={f.category} onChange={set("category")}>{(legal ? LEGAL_ISSUES : FIN_PROGRAMMES).map(o => <option key={o}>{o}</option>)}</select>
        </label>
        {!legal && <label className="text-sm">Amount requested (USD)<input type="number" min="1" className={inputCls} value={f.amount} onChange={set("amount")} /></label>}
        <label className="text-sm md:col-span-2">{legal ? "Describe the problem" : "Explain your financial need"}<textarea rows={5} className={inputCls} value={f.description} onChange={set("description")} /></label>
        <label className="text-sm md:col-span-2">Supporting documents (PDF or images)<input type="file" multiple accept=".pdf,image/*" className="mt-1 block text-sm" onChange={e => setFiles(Array.from(e.target.files ?? []))} /></label>
        {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}
        <div className="md:col-span-2"><button className={btnCls}>Submit {legal ? "request" : "application"}</button></div>
      </form>
    </Card>
  );
}
