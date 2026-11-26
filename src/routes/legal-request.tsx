import { createFileRoute } from "@tanstack/react-router";
import { Page, RequireRole } from "@/components/Layout";
import { RequestForm } from "@/components/RequestForm";

export const Route = createFileRoute("/legal-request")({
  head: () => ({ meta: [{ title: "Legal Assistance Request | CR, Legal & Financial Access" }, { name: "description", content: "Tell us about your legal issue and a volunteer adviser will review it." }, { property: "og:title", content: "Legal Assistance Request | CR, Legal & Financial Access" }, { property: "og:description", content: "Tell us about your legal issue and a volunteer adviser will review it." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="applicant"><Page title="Legal Assistance Request" subtitle="Tell us about your legal issue and a volunteer adviser will review it."><RequestForm type="Legal" /></Page></RequireRole>,
});
