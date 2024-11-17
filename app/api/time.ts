import { LoaderFunctionArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils/sse/server'
import OpenAI from 'openai'
import { EventEmitter } from 'events'

// Increase the maximum number of listeners for AbortSignal
EventEmitter.defaultMaxListeners = 20

const openai = new OpenAI()
// time.ts
export async function loader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get('query')
  const connectionId = Math.random().toString(36).slice(2, 9) // Generate unique ID for this connection

  console.log(`🟦 [${connectionId}] New stream request for query: "${query}"`)

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
    let completed = false
    let chunkCount = 0

    async function sendMessages() {
      try {
        console.log(`🟨 [${connectionId}] Starting to stream chunks`)

        for await (const chunk of completion) {
          if (request.signal.aborted) {
            console.log(`🟥 [${connectionId}] Request aborted after ${chunkCount} chunks`)
            break
          }
          chunkCount++
          send({ event: 'time', data: chunk.choices[0]?.delta?.content || '' })
        }

        completed = true
        console.log(`🟩 [${connectionId}] Stream completed successfully after ${chunkCount} chunks`)
        send({ event: 'end', data: '' })
      } catch (error) {
        console.error(`🟥 [${connectionId}] Error during streaming:`, error)
        throw error
      }
    }

    sendMessages()

    // Cleanup function
    return () => {
      if (!completed) {
        console.log(`🟧 [${connectionId}] Stream cleanup triggered before completion (${chunkCount} chunks sent)`)
      } else {
        console.log(`⬜️ [${connectionId}] Normal cleanup after successful completion`)
      }
    }
  })
}
