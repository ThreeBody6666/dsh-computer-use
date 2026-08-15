import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/tools.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  external: [/^@deepseek-ai\//],
})
