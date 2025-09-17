import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-screen bg-slate-50 font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/70">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link to="/" className="text-lg font-semibold tracking-tight">
                AI Dance Studio
              </Link>
              <nav className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <a
                  href="https://developers.cloudflare.com/workers/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Workers 架构
                </a>
                <a
                  href="https://developers.cloudflare.com/r2/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  R2 存储
                </a>
              </nav>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-12 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-gray-200/80 bg-white/80 py-6 text-sm text-gray-500 dark:border-gray-800/80 dark:bg-gray-950/70 dark:text-gray-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <p>© {new Date().getFullYear()} AI Dance Studio · Built on Cloudflare</p>
              <p>全栈应用由单个 Worker 驱动 · 数据与 API 共存</p>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
