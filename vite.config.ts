import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import babel from 'vite-plugin-babel';
import path from "path";

export default defineConfig({
    plugins: [
      react(),
        babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8787",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                },
            },
        },
    },
});
