import { LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'
import OpenAI from 'openai'
import { EventEmitter } from 'events'

// Increase the maximum number of listeners for AbortSignal
EventEmitter.defaultMaxListeners = 20

const openai = new OpenAI()

export async function loader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get('query')
  console.log(`GET: Completion Loader called with query: ${query}`)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: 'Write a haiku about recursion in programming.',
      },
    ],
  })

  const theMessage = completion.choices[0].message
  console.log('\n', `theMessage = `, theMessage, '\n')

  return eventStream(request.signal, function setup(send) {
    const intervalId = setInterval(() => {
      send({ event: 'time', data: new Date().toISOString() })
    }, 1000)

    request.signal.addEventListener('abort', () => {
      clearInterval(intervalId)
    })

    return () => {
      clearInterval(intervalId)
    }
  })
}
