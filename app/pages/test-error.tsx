import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useRouteError } from '@remix-run/react'
import { captureRemixErrorBoundaryError } from '@sentry/remix'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Throw error
  throw new Error('Error in test-error.tsx loader function', {
    cause: request.url,
  })

  return null
}

export default function TestError() {
  return (
    <div className="font-sans p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Hello Remix, Drizzle, Postgresql</h1>
      {/* Throw sentry error */}
      <button
        type="button"
        onClick={() => {
          throw new Error('Some Custom Message')
        }}
      >
        Throw error
      </button>
    </div>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  captureRemixErrorBoundaryError(error)
  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Something went wrong</h2>

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
  )
}
