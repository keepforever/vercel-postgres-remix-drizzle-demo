import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { loader as usersApiLoader } from '~/api/users'

/**
 * Custom hook for abstracting the useFetcher hook for API calls.
 * This hook initializes a fetcher instance for a given API endpoint
 * and manages its loading state.
 *
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @returns The fetcher instance with loaded data or loading state.
 */
function useApiLoader<T>(endpoint: string) {
  const myFetcher = useFetcher<T>({
    key: `api:${endpoint}`,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const load = async () => {
      myFetcher.load(endpoint)
      setIsMounted(true)
    }

    if (isMounted) return
    load()
  }, [isMounted, myFetcher, endpoint])

  return myFetcher
}

export default function UseFetcherExample() {
  const myFetcher = useApiLoader<typeof usersApiLoader>('/api/users')

  return (
    <div className="pt-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">UseFetcher Example</h1>

      {myFetcher.data?.users ? (
        <div className="grid md:grid-cols-3 gap-4">
          {myFetcher.data.users.map(user => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className={`text-sm ${user.role === 'admin' ? 'text-red-500' : 'text-green-500'}`}>
                {user?.role?.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
