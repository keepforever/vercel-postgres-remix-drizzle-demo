import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Throw error
  throw new Error("Error in test-error.tsx loader function", {
    cause: request.url,
  });

  return null;
};

export default function TestError() {
  return (
    <div className="font-sans p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">
        Hello Remix, Drizzle, Postgresql
      </h1>
      {/* Throw sentry error */}
      <button
        type="button"
        onClick={() => {
          throw new Error("Some Custom Message");
        }}
      >
        Throw error
      </button>
    </div>
  );
}
