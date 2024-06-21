import { captureRemixErrorBoundaryError } from "@sentry/remix";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import { AppShell } from "./components/app-shell";
// Import rootAuthLoader
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { ClerkApp, UserButton } from "@clerk/remix";

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, ({ request }) => {
    const { userId } = request.auth;
    // const token = getToken();

    return { userId };
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Link
              to="/"
              className="inline-block px-5 py-3 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="absolute top-0 right-0 z-50 shadow-md">
        <UserButton />
      </div>
      <Outlet />
    </>
  );
}

export default ClerkApp(App);
