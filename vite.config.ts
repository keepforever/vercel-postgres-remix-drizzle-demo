import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "pages/home.tsx", { index: true });
          route("test-error", "pages/test-error.tsx");
          route("users", "pages/users/users-layout.tsx", () => {
            route("", "pages/users/users-home.tsx", { index: true });
            route(":userId", "pages/users/$userId.tsx");
          });
        });
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "keep-forever-ltd",
      project: "javascript-remix",
    }),
  ],
  build: {
    sourcemap: true,
  },
});
