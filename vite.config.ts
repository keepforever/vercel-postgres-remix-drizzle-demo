import { sentryVitePlugin } from '@sentry/vite-plugin'
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
      },
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'pages/home.tsx', { index: true })
          route('test-error', 'pages/test-error.tsx')
          route('openai', 'pages/openai.tsx')
          route('api/users', 'api/users.tsx')
          route('api/time', 'api/time.ts')
          route('use-fetcher-example', 'pages/use-fetcher-example.tsx')
          route('sign-up', 'pages/sign-up.tsx')
          route('sign-in', 'pages/sign-in.tsx')
          route('conform-zod-demo', 'pages/conform-zod-demo.tsx')
          route('defer-example', 'pages/defer-example.tsx')
          route('users', 'pages/users/users-layout.tsx', () => {
            route('', 'pages/users/users-home.tsx', { index: true })
            route(':userId', 'pages/users/$userId.tsx', () => {
              route('posts', 'pages/users/posts/posts-layout.tsx', () => {
                route('', 'pages/users/posts/posts-home.tsx', { index: true })
                route('new', 'pages/users/posts/posts-new.tsx')
                route(':postId', 'pages/users/posts/$postId.tsx', () => {
                  route('edit', 'pages/users/posts/posts-edit.tsx')
                })
              })
            })
          })
        })
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'keep-forever-ltd',
      project: 'javascript-remix',
    }),
  ],
  build: {
    sourcemap: true,
  },
})

declare module '@remix-run/server-runtime' {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true
  }
}
