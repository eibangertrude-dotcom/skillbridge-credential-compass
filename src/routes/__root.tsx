import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Layout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Credential Recognition, Legal & Financial Access System" },
      { name: "description", content: "Submit, verify and manage academic credential recognition applications." },
            { property: "og:title", content: "Credential Recognition, Legal & Financial Access System" },
      { property: "og:description", content: "Submit, verify and manage academic credential recognition applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:wght@600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <StoreProvider>
        <div className="min-h-screen">
          <Header />
          <Outlet />
          <footer className="mt-12 border-t bg-card">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-serif text-base font-bold text-primary">Credential Recognition, Legal & Financial Access System</p>
                <p className="mt-2 text-xs text-muted-foreground">One account to get your qualifications recognised, understand your rights and apply for funding.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Services</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><Link to="/apply" className="text-muted-foreground hover:text-foreground">Apply for recognition</Link></li>
                  <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">Legal information</Link></li>
                  <li><Link to="/financial" className="text-muted-foreground hover:text-foreground">Financial assistance</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Requests</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><Link to="/legal-request" className="text-muted-foreground hover:text-foreground">Request legal assistance</Link></li>
                  <li><Link to="/financial-apply" className="text-muted-foreground hover:text-foreground">Apply for funding</Link></li>
                  <li><Link to="/track" className="text-muted-foreground hover:text-foreground">Track my requests</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Account</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><Link to="/register" className="text-muted-foreground hover:text-foreground">Register</Link></li>
                  <li><Link to="/login" className="text-muted-foreground hover:text-foreground">Log in</Link></li>
                  <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">My applications</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t py-4 text-center text-xs text-muted-foreground">Credential Recognition, Legal & Financial Access System · Supporting SDG 4 (Quality Education) & SDG 8 (Decent Work)</div>
          </footer>
        </div>
      </StoreProvider>
    </QueryClientProvider>
  );
}
