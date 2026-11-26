import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Page, btnCls, inputCls } from "@/components/Layout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register | CR, Legal & Financial Access" }, { name: "description", content: "Create an applicant account to apply for academic credential recognition." }, { property: "og:title", content: "Register | CR, Legal & Financial Access" }, { property: "og:description", content: "Create an applicant account to apply for academic credential recognition." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Register,
});

function Register() {
  const { register } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 6) return setError("Password must be at least 6 characters.");
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    const err = register(f.name, f.email, f.password);
    if (err) return setError(err);
    nav({ to: "/dashboard" });
  };

  return (
    <Page title="Create an applicant account">
      <Card className="max-w-md">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium">Full name<input required className={inputCls + " mt-1"} value={f.name} onChange={set("name")} /></label>
          <label className="block text-sm font-medium">Email<input type="email" required className={inputCls + " mt-1"} value={f.email} onChange={set("email")} /></label>
          <label className="block text-sm font-medium">Password<input type="password" required className={inputCls + " mt-1"} value={f.password} onChange={set("password")} /></label>
          <label className="block text-sm font-medium">Confirm password<input type="password" required className={inputCls + " mt-1"} value={f.confirm} onChange={set("confirm")} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button className={btnCls + " w-full"}>Register</button>
          <p className="text-sm text-muted-foreground">Already registered? <Link to="/login" className="font-medium text-primary underline">Log in</Link></p>
        </form>
      </Card>
    </Page>
  );
}
