import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"]
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom", "node:util"]
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
})
