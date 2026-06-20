import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
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
                manualChunks: (id) => {
                    if (
                        id.includes("node_modules/react") ||
                        id.includes("node_modules/react-dom") ||
                        id.includes("node_modules/react-router-dom")
                    ) {
                        return "react-vendor";
                    }
                    return undefined;
                },
            },
        },
    },
});
