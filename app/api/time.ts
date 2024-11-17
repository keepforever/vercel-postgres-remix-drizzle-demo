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
        content: `Write a sentence about ${query}.`,
      },
    ],
    stream: true,
  })

  return eventStream(request.signal, function setup(send) {
    async function sendMessages() {
      for await (const chunk of completion) {
        send({ event: 'time', data: chunk.choices[0]?.delta?.content || '' })
      }
    }

    sendMessages()

    let counter = 0

    return () => {
      console.log(
        '\n',
        `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        
        hello from loader

        ${counter++}
        
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`,
        '\n',
      )
    }
  })
}
