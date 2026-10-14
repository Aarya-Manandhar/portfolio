import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/chat')) {
          return next();
        }

        let raw = '';
        for await (const chunk of req) {
          raw += chunk;
        }

        let body = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }

        const adapter = {
          status(code: number) {
            res.statusCode = code;
            return this;
          },
          setHeader(name: string, value: string) {
            res.setHeader(name, value);
          },
          json(payload: unknown) {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(payload));
          },
        };

        try {
          const apiFileUrl = `${pathToFileURL(path.resolve(process.cwd(), 'api', 'chat.js')).href}?t=${Date.now()}`;
          const { default: handler } = await import(apiFileUrl);
          await handler({ method: req.method, body, headers: req.headers }, adapter);
        } catch (err: unknown) {
          const errorObj = err as Error;
          console.error('Dev API handler error:', errorObj);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ error: errorObj?.message || 'Server error' }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env for local API execution
  for (const [key, val] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }

  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
  };
});
