import { SignedIn } from '@clerk/remix'
import { type MetaFunction, type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useEffect, useRef, useState } from 'react'
import { useEventSource } from 'remix-utils/sse/react'
import { ServerEventKey } from '~/constants'
import { useAnimatedText } from '~/hooks/useAnimatedText'

export const meta: MetaFunction = () => {
  return [{ title: 'Chat Demo' }, { name: 'description', content: 'Chat Demo' }]
}

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args
  const host = request.headers.get('host')
  if (!host?.includes('localhost')) {
    return redirect('/')
  }

  return {}
}

export default function Index() {
  const [results, setResults] = useState('')
  const eventSourceRef = useRef<EventSource | null>(null)
  const connectionCountRef = useRef(0) // Track connection count for debugging
  const isStreaming = eventSourceRef.current !== null

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        console.log('🔴 Closing EventSource on component unmount')
        eventSourceRef.current.close()
      }
    }
  }, [])

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (eventSourceRef.current) {
      console.log('🔴 Closing previous EventSource connection')
      eventSourceRef.current.close()
      setResults('')
    }

    const formData = new FormData(event.target as HTMLFormElement)
    const query = formData.get('query')
    const encodedQuery = encodeURIComponent(query as string)

    const sse = new EventSource(`/api/time${encodedQuery ? `?query=${encodedQuery}` : ''}`)
    eventSourceRef.current = sse
    connectionCountRef.current++

    console.log(`🟢 Opening new EventSource connection #${connectionCountRef.current}`)

    sse.addEventListener('open', () => {
      console.log(`📡 Connection #${connectionCountRef.current} established`)
    })

    sse.addEventListener(ServerEventKey.Time, event => {
      setResults(prevResults => prevResults + event.data)
    })

    sse.addEventListener('end', () => {
      console.log(`✅ Stream #${connectionCountRef.current} completed successfully`)
      sse.close()
      eventSourceRef.current = null
    })

    sse.addEventListener('error', event => {
      console.log(`❌ Error on connection #${connectionCountRef.current}:`, event)
      sse.close()
      eventSourceRef.current = null
    })

    // Clean state on close
    sse.addEventListener('close', () => {
      console.log(`🔚 Connection #${connectionCountRef.current} closed`)
      eventSourceRef.current = null
    })
  }

  const animatedText = useAnimatedText(results)

  return (
    <div className="font-sans p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Hello Remix, Drizzle, Postgresql</h1>

      <SignedIn>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <label htmlFor="query">Query:</label>
          <input
            type="text"
            name="query"
            placeholder="Enter your query"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-3xl disabled:bg-gray-100"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={isStreaming}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? 'Streaming...' : 'Submit'}
            </button>
          </div>
        </form>
      </SignedIn>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Results:</h1>
        <div className="max-w-2xl">
          <p>{animatedText}</p>
        </div>
      </div>
    </div>
  )
}

export function Counter() {
  // Here `/sse/time` is the resource route returning an eventStream response
  const time = useEventSource('/api/time', { event: ServerEventKey.Time })

  if (!time) return null

  return (
    <time dateTime={time}>
      {new Date(time).toLocaleTimeString('en', {
        minute: '2-digit',
        second: '2-digit',
        hour: '2-digit',
      })}
    </time>
  )
}
