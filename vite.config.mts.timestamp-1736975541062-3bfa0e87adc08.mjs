// vite.config.mts
import AutoImport from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/unplugin-vue-components/dist/vite.js";
import Fonts from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/unplugin-fonts/dist/vite.mjs";
import Layouts from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Vue from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/unplugin-vue-router/dist/vite.js";
import Vuetify, { transformAssetUrls } from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/vite-plugin-vuetify/dist/index.mjs";
import vueDevTools from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { defineConfig } from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
import ViteYaml from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/@modyfi/vite-plugin-yaml/dist/index.js";
import { splitVendorChunkPlugin } from "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///home/thiago-esterci/Repositories/cgs/drunagor_app_front/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter({
      dts: "src/typed-router.d.ts"
    }),
    ViteYaml(),
    Layouts(),
    splitVendorChunkPlugin(),
    AutoImport({
      imports: [
        "vue",
        {
          "vue-router/auto": ["useRoute", "useRouter"]
        }
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true
      },
      vueTemplate: true
    }),
    Components({
      dts: "src/components.d.ts"
    }),
    Vue({
      template: { transformAssetUrls }
    }),
    vueDevTools(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    }),
    Fonts({
      google: {
        families: [{
          name: "Roboto",
          styles: "wght@100;300;400;500;700;900"
        }]
      }
    })
  ],
  build: {
    manifest: true,
    // Generates a manifest file for advanced caching
    outDir: "dist",
    // Default output directory
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]"
      }
    }
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  server: {
    port: 3e3
  },
  optimizeDeps: {
    include: ["@/locales/**/*.yaml"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvdGhpYWdvLWVzdGVyY2kvUmVwb3NpdG9yaWVzL2Nncy9kcnVuYWdvcl9hcHBfZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3RoaWFnby1lc3RlcmNpL1JlcG9zaXRvcmllcy9jZ3MvZHJ1bmFnb3JfYXBwX2Zyb250L3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS90aGlhZ28tZXN0ZXJjaS9SZXBvc2l0b3JpZXMvY2dzL2RydW5hZ29yX2FwcF9mcm9udC92aXRlLmNvbmZpZy5tdHNcIjsvLyBQbHVnaW5zXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBGb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xyXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcclxuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xyXG5pbXBvcnQgVnVldGlmeSwgeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICd2aXRlLXBsdWdpbi12dWV0aWZ5J1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5cclxuLy8gVXRpbGl0aWVzXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgVml0ZVlhbWwgZnJvbSBcIkBtb2R5Zmkvdml0ZS1wbHVnaW4teWFtbFwiO1xyXG5pbXBvcnQgeyBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgVnVlUm91dGVyKHtcclxuICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyxcclxuICAgIH0pLFxyXG4gICAgVml0ZVlhbWwoKSxcclxuICAgIExheW91dHMoKSxcclxuICAgIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4oKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJ3Z1ZS1yb3V0ZXIvYXV0byc6IFsndXNlUm91dGUnLCAndXNlUm91dGVyJ10sXHJcbiAgICAgICAgfVxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICB9KSxcclxuICAgIFZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9LFxyXG4gICAgfSksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5LWxvYWRlci90cmVlL21hc3Rlci9wYWNrYWdlcy92aXRlLXBsdWdpbiNyZWFkbWVcclxuICAgIFZ1ZXRpZnkoe1xyXG4gICAgICBhdXRvSW1wb3J0OiB0cnVlLFxyXG4gICAgICBzdHlsZXM6IHtcclxuICAgICAgICBjb25maWdGaWxlOiAnc3JjL3N0eWxlcy9zZXR0aW5ncy5zY3NzJyxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgRm9udHMoe1xyXG4gICAgICBnb29nbGU6IHtcclxuICAgICAgICBmYW1pbGllczogWyB7XHJcbiAgICAgICAgICBuYW1lOiAnUm9ib3RvJyxcclxuICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnLFxyXG4gICAgICAgIH1dLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgbWFuaWZlc3Q6IHRydWUsIC8vIEdlbmVyYXRlcyBhIG1hbmlmZXN0IGZpbGUgZm9yIGFkdmFuY2VkIGNhY2hpbmdcclxuICAgIG91dERpcjogJ2Rpc3QnLCAvLyBEZWZhdWx0IG91dHB1dCBkaXJlY3RvcnlcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5qcycsXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5qcycsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5bZXh0XScsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7ICdwcm9jZXNzLmVudic6IHt9IH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICB9LFxyXG4gICAgZXh0ZW5zaW9uczogW1xyXG4gICAgICAnLmpzJyxcclxuICAgICAgJy5qc29uJyxcclxuICAgICAgJy5qc3gnLFxyXG4gICAgICAnLm1qcycsXHJcbiAgICAgICcudHMnLFxyXG4gICAgICAnLnRzeCcsXHJcbiAgICAgICcudnVlJyxcclxuICAgIF0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcIkAvbG9jYWxlcy8qKi8qLnlhbWxcIl0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sV0FBVztBQUNsQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZUFBZTtBQUN0QixPQUFPLFdBQVcsMEJBQTBCO0FBQzVDLE9BQU8saUJBQWlCO0FBR3hCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sY0FBYztBQUNyQixTQUFTLDhCQUE4QjtBQWRrTCxJQUFNLDJDQUEyQztBQWlCMVEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsU0FBUztBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsdUJBQXVCO0FBQUEsSUFDdkIsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsVUFDRSxtQkFBbUIsQ0FBQyxZQUFZLFdBQVc7QUFBQSxRQUM3QztBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsTUFDRixVQUFVLEVBQUUsbUJBQW1CO0FBQUEsSUFDakMsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBO0FBQUEsSUFFWixRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixRQUFRO0FBQUEsUUFDTixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0osUUFBUTtBQUFBLFFBQ04sVUFBVSxDQUFFO0FBQUEsVUFDVixNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFVBQVU7QUFBQTtBQUFBLElBQ1YsUUFBUTtBQUFBO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEVBQUUsZUFBZSxDQUFDLEVBQUU7QUFBQSxFQUM1QixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsSUFDQSxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLHFCQUFxQjtBQUFBLEVBQ2pDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
