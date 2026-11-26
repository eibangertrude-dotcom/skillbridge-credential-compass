import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, btnCls, btnOutline, inputCls } from "@/components/Layout";
import { useStore, type Role } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in | CR, Legal & Financial Access" }, { name: "description", content: "Log in to submit or review credential recognition applications." }, { property: "og:title", content: "Log in | CR, Legal & Financial Access" }, { property: "og:description", content: "Log in to submit or review credential recognition applications." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Login,
});

function Login() {
  const { login, loginAs } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const go = (role: Role) => nav({ to: role === "admin" ? "/admin" : "/dashboard" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) return setError("Incorrect email or password.");
    go(email.toLowerCase() === "admin@demo.com" ? "admin" : "applicant");
  };

  return (
    <Page title="Log in">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium">Email<input type="email" required className={inputCls + " mt-1"} value={email} onChange={e => setEmail(e.target.value)} /></label>
            <label className="block text-sm font-medium">Password<input type="password" required className={inputCls + " mt-1"} value={password} onChange={e => setPassword(e.target.value)} /></label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className={btnCls + " w-full"}>Log in</button>
            <p className="text-sm text-muted-foreground">No account? <Link to="/register" className="font-medium text-primary underline">Register</Link></p>
          </form>
        </Card>
        <Card className="bg-secondary">
          <h2 className="font-semibold text-primary">Quick demo access</h2>
          <p className="mt-1 text-sm text-muted-foreground">Switch roles instantly for the presentation.</p>
          <div className="mt-4 flex flex-col gap-3">
            <button className={btnCls} onClick={() => { loginAs("applicant"); go("applicant"); }}>Continue as Applicant (Amina)</button>
            <button className={btnOutline} onClick={() => { loginAs("admin"); go("admin"); }}>Continue as Administrator</button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Or use: applicant@demo.com / demo123 · admin@demo.com / admin123</p>
        </Card>
      </div>
    </Page>
  );
}
