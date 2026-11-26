// Simple client-side data store (localStorage) for the demo. No backend needed.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Status = "Pending" | "Under Review" | "Approved" | "Rejected";
export type Role = "applicant" | "admin";
export interface User { id: string; name: string; email: string; password: string; role: Role }
export interface Doc { name: string; type: string; size: number; url?: string; kind: "Certificate" | "Transcript" | "Additional" }
export interface Comment { author: string; text: string; date: string }
export interface Application {
  id: string; userId: string; fullName: string; email: string; phone: string; address: string;
  institution: string; qualification: string; course: string; year: string; country: string;
  docs: Doc[]; status: Status; docsRequested: boolean; comments: Comment[]; submittedAt: string;
}
export type ReqType = "Legal" | "Financial";
/** Legal assistance request or financial assistance application (one shared table). */
export interface AidRequest {
  id: string; userId: string; type: ReqType; fullName: string; email: string; phone: string;
  category: string; // legal issue type, or financial programme
  description: string; amount?: number; docs: Doc[]; status: Status; comments: Comment[]; submittedAt: string;
}
interface Data { users: User[]; apps: Application[]; requests: AidRequest[]; currentUserId: string | null }

const KEY = "crs-data-v2";
const today = (d = 0) => new Date(Date.now() - d * 86400000).toISOString();

const seed: Data = {
  currentUserId: null,
  users: [
    { id: "u1", name: "Amina Okafor", email: "applicant@demo.com", password: "demo123", role: "applicant" },
    { id: "u2", name: "Carlos Mendes", email: "carlos@demo.com", password: "demo123", role: "applicant" },
    { id: "a1", name: "Dr. Grace Mensah", email: "admin@demo.com", password: "admin123", role: "admin" },
  ],
  apps: [
    { id: "CRS-1001", userId: "u1", fullName: "Amina Okafor", email: "applicant@demo.com", phone: "+234 801 234 5678", address: "12 Marina Rd, Lagos", institution: "University of Lagos", qualification: "Bachelor's Degree", course: "Computer Science", year: "2019", country: "Nigeria", docs: [{ name: "degree_certificate.pdf", type: "application/pdf", size: 245000, kind: "Certificate" }, { name: "transcript.pdf", type: "application/pdf", size: 512000, kind: "Transcript" }], status: "Under Review", docsRequested: false, comments: [{ author: "Dr. Grace Mensah", text: "Documents received. Verifying with the institution.", date: today(2) }], submittedAt: today(6) },
    { id: "CRS-1002", userId: "u1", fullName: "Amina Okafor", email: "applicant@demo.com", phone: "+234 801 234 5678", address: "12 Marina Rd, Lagos", institution: "Yaba College of Technology", qualification: "Diploma", course: "Electrical Engineering", year: "2015", country: "Nigeria", docs: [{ name: "diploma.jpg", type: "image/jpeg", size: 180000, kind: "Certificate" }], status: "Approved", docsRequested: false, comments: [{ author: "Dr. Grace Mensah", text: "Verified. Recognised as equivalent to a national Diploma.", date: today(20) }], submittedAt: today(30) },
    { id: "CRS-1003", userId: "u2", fullName: "Carlos Mendes", email: "carlos@demo.com", phone: "+55 11 9876 5432", address: "Rua Augusta 200, São Paulo", institution: "Universidade de São Paulo", qualification: "Master's Degree", course: "Economics", year: "2021", country: "Brazil", docs: [{ name: "masters_certificate.pdf", type: "application/pdf", size: 300000, kind: "Certificate" }], status: "Pending", docsRequested: false, comments: [], submittedAt: today(1) },
    { id: "CRS-1004", userId: "u2", fullName: "Carlos Mendes", email: "carlos@demo.com", phone: "+55 11 9876 5432", address: "Rua Augusta 200, São Paulo", institution: "Instituto Federal", qualification: "Certificate", course: "Accounting", year: "2012", country: "Brazil", docs: [{ name: "certificate_scan.png", type: "image/png", size: 90000, kind: "Certificate" }], status: "Rejected", docsRequested: false, comments: [{ author: "Dr. Grace Mensah", text: "Institution could not be verified as accredited.", date: today(10) }], submittedAt: today(15) },
    { id: "CRS-1005", userId: "u2", fullName: "Fatima Noor", email: "fatima@example.com", phone: "+92 300 111 2222", address: "Karachi", institution: "University of Karachi", qualification: "Bachelor's Degree", course: "Nursing", year: "2018", country: "Pakistan", docs: [{ name: "transcript_nursing.pdf", type: "application/pdf", size: 410000, kind: "Transcript" }], status: "Pending", docsRequested: false, comments: [], submittedAt: today(0) },
  ],
  requests: [
    { id: "LGL-2001", userId: "u1", type: "Legal", fullName: "Amina Okafor", email: "applicant@demo.com", phone: "+234 801 234 5678", category: "Employment", description: "My employer has not paid my wages for two months.", docs: [{ name: "contract.pdf", type: "application/pdf", size: 120000, kind: "Additional" }], status: "Under Review", comments: [{ author: "Dr. Grace Mensah", text: "Assigned to a legal aid volunteer.", date: today(1) }], submittedAt: today(4) },
    { id: "LGL-2002", userId: "u2", type: "Legal", fullName: "Carlos Mendes", email: "carlos@demo.com", phone: "+55 11 9876 5432", category: "Immigration / Residence", description: "Need help renewing my residence permit.", docs: [], status: "Pending", comments: [], submittedAt: today(0) },
    { id: "FIN-3001", userId: "u1", type: "Financial", fullName: "Amina Okafor", email: "applicant@demo.com", phone: "+234 801 234 5678", category: "Bridging Certification Grant", description: "Funding for a bridging course to have my degree fully recognised.", amount: 800, docs: [{ name: "course_quote.pdf", type: "application/pdf", size: 90000, kind: "Additional" }], status: "Approved", comments: [{ author: "Dr. Grace Mensah", text: "Approved for the full amount.", date: today(3) }], submittedAt: today(12) },
    { id: "FIN-3002", userId: "u2", type: "Financial", fullName: "Carlos Mendes", email: "carlos@demo.com", phone: "+55 11 9876 5432", category: "Emergency Hardship Fund", description: "Rent arrears after losing my job.", amount: 1500, docs: [], status: "Rejected", comments: [{ author: "Dr. Grace Mensah", text: "Amount exceeds the fund limit of 1,000.", date: today(5) }], submittedAt: today(9) },
  ],
};

interface Store extends Data {
  ready: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginAs: (role: Role) => void;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  submit: (a: Omit<Application, "id" | "userId" | "status" | "docsRequested" | "comments" | "submittedAt">) => void;
  update: (id: string, patch: Partial<Application>) => void;
  addComment: (id: string, text: string) => void;
  reset: () => void;
  submitRequest: (r: Omit<AidRequest, "id" | "userId" | "status" | "comments" | "submittedAt">) => string;
  updateRequest: (id: string, patch: Partial<AidRequest>) => void;
  commentRequest: (id: string, text: string) => void;
}
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setData(JSON.parse(s)); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { /* storage full: drop file previews */ localStorage.setItem(KEY, JSON.stringify({ ...data, apps: data.apps.map(a => ({ ...a, docs: a.docs.map(d => ({ ...d, url: undefined })) })) })); }
  }, [data, ready]);

  const user = data.users.find(u => u.id === data.currentUserId) ?? null;
  const store: Store = {
    ...data, ready, user,
    login: (email, password) => {
      const u = data.users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
      if (u) setData(d => ({ ...d, currentUserId: u.id }));
      return !!u;
    },
    loginAs: role => setData(d => ({ ...d, currentUserId: role === "admin" ? "a1" : "u1" })),
    register: (name, email, password) => {
      if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return "An account with this email already exists.";
      const u: User = { id: "u" + Date.now(), name, email, password, role: "applicant" };
      setData(d => ({ ...d, users: [...d.users, u], currentUserId: u.id }));
      return null;
    },
    logout: () => setData(d => ({ ...d, currentUserId: null })),
    submit: a => setData(d => ({ ...d, apps: [{ ...a, id: "CRS-" + (1001 + d.apps.length + Math.floor(Math.random() * 900)), userId: d.currentUserId!, status: "Pending", docsRequested: false, comments: [], submittedAt: new Date().toISOString() }, ...d.apps] })),
    update: (id, patch) => setData(d => ({ ...d, apps: d.apps.map(a => a.id === id ? { ...a, ...patch } : a) })),
    addComment: (id, text) => setData(d => ({ ...d, apps: d.apps.map(a => a.id === id ? { ...a, comments: [...a.comments, { author: user?.name ?? "System", text, date: new Date().toISOString() }] } : a) })),
    submitRequest: r => {
      const id = (r.type === "Legal" ? "LGL-" : "FIN-") + (4000 + Math.floor(Math.random() * 5000));
      setData(d => ({ ...d, requests: [{ ...r, id, userId: d.currentUserId!, status: "Pending", comments: [], submittedAt: new Date().toISOString() }, ...d.requests] }));
      return id;
    },
    updateRequest: (id, patch) => setData(d => ({ ...d, requests: d.requests.map(r => r.id === id ? { ...r, ...patch } : r) })),
    commentRequest: (id, text) => setData(d => ({ ...d, requests: d.requests.map(r => r.id === id ? { ...r, comments: [...r.comments, { author: user?.name ?? "System", text, date: new Date().toISOString() }] } : r) })),
    reset: () => setData({ ...seed, currentUserId: data.currentUserId }),
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
export const countBy = (apps: { status: Status }[]) => ({
  total: apps.length,
  pending: apps.filter(a => a.status === "Pending").length,
  review: apps.filter(a => a.status === "Under Review").length,
  approved: apps.filter(a => a.status === "Approved").length,
  rejected: apps.filter(a => a.status === "Rejected").length,
});

export function readFile(file: File, kind: Doc["kind"]): Promise<Doc> {
  return new Promise(res => {
    const base = { name: file.name, type: file.type, size: file.size, kind };
    if (file.size > 1_500_000) return res(base); // too big to keep a preview in browser storage
    const r = new FileReader();
    r.onload = () => res({ ...base, url: r.result as string });
    r.onerror = () => res(base);
    r.readAsDataURL(file);
  });
}
