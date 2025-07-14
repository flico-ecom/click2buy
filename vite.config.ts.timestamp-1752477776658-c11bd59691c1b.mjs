// vite.config.ts
import { qwikCity } from 'file:///C:/Users/AmilaDev/Desktop/production/click2buy/node_modules/.pnpm/@builder.io+qwik-city@1.14._ea19e047737eccb5c7a4c3450bef13d3/node_modules/@builder.io/qwik-city/lib/vite/index.mjs';
import { qwikVite } from 'file:///C:/Users/AmilaDev/Desktop/production/click2buy/node_modules/.pnpm/@builder.io+qwik@1.14.1_vite@5.4.6_@types+node@20.11.17_/node_modules/@builder.io/qwik/dist/optimizer.mjs';
import { defineConfig } from 'file:///C:/Users/AmilaDev/Desktop/production/click2buy/node_modules/.pnpm/vite@5.4.6_@types+node@20.11.17/node_modules/vite/dist/node/index.js';
import tsconfigPaths from 'file:///C:/Users/AmilaDev/Desktop/production/click2buy/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_t_e5ec8c0df26ad29530dbce45d632d17e/node_modules/vite-tsconfig-paths/dist/index.mjs';
var vite_config_default = defineConfig(async (config) => {
	return {
		// Enable to analyze via source-map-explorer
		// ssr: { target: 'webworker' },
		build: {
			sourcemap: config.mode === 'development',
		},
		plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
		preview: {
			headers: {
				'Cache-Control': 'public, max-age=600',
			},
		},
	};
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbWlsYURldlxcXFxEZXNrdG9wXFxcXHByb2R1Y3Rpb25cXFxcY2xpY2syYnV5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbWlsYURldlxcXFxEZXNrdG9wXFxcXHByb2R1Y3Rpb25cXFxcY2xpY2syYnV5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9BbWlsYURldi9EZXNrdG9wL3Byb2R1Y3Rpb24vY2xpY2syYnV5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrLWNpdHkvdml0ZSc7XHJcbmltcG9ydCB7IHF3aWtWaXRlIH0gZnJvbSAnQGJ1aWxkZXIuaW8vcXdpay9vcHRpbWl6ZXInO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKGNvbmZpZykgPT4ge1xyXG5cdHJldHVybiB7XHJcblx0XHQvLyBFbmFibGUgdG8gYW5hbHl6ZSB2aWEgc291cmNlLW1hcC1leHBsb3JlclxyXG5cdFx0Ly8gc3NyOiB7IHRhcmdldDogJ3dlYndvcmtlcicgfSxcclxuXHRcdGJ1aWxkOiB7XHJcblx0XHRcdHNvdXJjZW1hcDogY29uZmlnLm1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcblx0XHR9LFxyXG5cdFx0cGx1Z2luczogW3F3aWtDaXR5KCksIHF3aWtWaXRlKCksIHRzY29uZmlnUGF0aHMoKV0sXHJcblx0XHRwcmV2aWV3OiB7XHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ2FjaGUtQ29udHJvbCc6ICdwdWJsaWMsIG1heC1hZ2U9NjAwJyxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0fTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxnQkFBZ0I7QUFDalcsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxvQkFBNkI7QUFDdEMsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhLE9BQU8sV0FBVztBQUM3QyxTQUFPO0FBQUE7QUFBQTtBQUFBLElBR04sT0FBTztBQUFBLE1BQ04sV0FBVyxPQUFPLFNBQVM7QUFBQSxJQUM1QjtBQUFBLElBQ0EsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQUEsSUFDakQsU0FBUztBQUFBLE1BQ1IsU0FBUztBQUFBLFFBQ1IsaUJBQWlCO0FBQUEsTUFDbEI7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
