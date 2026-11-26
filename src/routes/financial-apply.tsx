import { createFileRoute } from "@tanstack/react-router";
import { Page, RequireRole } from "@/components/Layout";
import { RequestForm } from "@/components/RequestForm";

export const Route = createFileRoute("/financial-apply")({
  head: () => ({ meta: [{ title: "Financial Assistance Application | CR, Legal & Financial Access" }, { name: "description", content: "Explain your financial need and request support." }, { property: "og:title", content: "Financial Assistance Application | CR, Legal & Financial Access" }, { property: "og:description", content: "Explain your financial need and request support." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <RequireRole role="applicant"><Page title="Financial Assistance Application" subtitle="Explain your financial need and request support."><RequestForm type="Financial" /></Page></RequireRole>,
});
