import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import uni from "@dcloudio/vite-plugin-uni";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const define = {};

	for (const key in env) {
		if (Object.prototype.hasOwnProperty.call(env, key)) {
			define[`import.meta.env.${key}`] = JSON.stringify(env[key]);
		}
	}

	return {
		base: "./",
		define,
		server: {
			proxy: {
				"/api": {
					target: "https://gitee.com",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
		resolve: {
			alias: {
				"@src": resolve(__dirname, "src"),
				"@pages": resolve(__dirname, "src/pages"),
				"@assets": resolve(__dirname, "src/assets"),
				"@components": resolve(__dirname, "src/components"),
				"@api": resolve(__dirname, "src/api"),
				"@utils": resolve(__dirname, "src/utils"),
			},
		},
		plugins: [uni()],
	};
});
