import { resolve } from "node:path";

import tailwindCSS from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import mdx from "@mdx-js/rollup";

// https://vite.dev/config/
export default defineConfig({
	build: {
		cssMinify: "lightningcss",
		outDir: "dist",
	},
	css: {
		transformer: "lightningcss",
	},
	plugins: [
		mdx(),
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindCSS(),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 9705,
	},
});
