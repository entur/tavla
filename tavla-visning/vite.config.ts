import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["chrome 49"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
      modernPolyfills: true,
    }),
    tailwindcss(),
  ],

  build: {
    target: "es2015",
    minify: "esbuild",
  },
  esbuild: {
    target: "es2015",
  },
});
