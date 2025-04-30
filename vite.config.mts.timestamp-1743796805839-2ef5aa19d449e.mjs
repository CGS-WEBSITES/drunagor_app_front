// vite.config.mts
import AutoImport from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/unplugin-vue-components/dist/vite.js";
import Fonts from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/unplugin-fonts/dist/vite.mjs";
import Layouts from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Vue from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/unplugin-vue-router/dist/vite.js";
import Vuetify, { transformAssetUrls } from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/vite-plugin-vuetify/dist/index.mjs";
import vueDevTools from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
import ViteYaml from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/@modyfi/vite-plugin-yaml/dist/index.js";
import { splitVendorChunkPlugin } from "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/leand/OneDrive/Documentos/Projetos/AppDrunagor/drunagor_app_front/vite.config.mts";
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
  },
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
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbGVhbmRcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRvc1xcXFxQcm9qZXRvc1xcXFxBcHBEcnVuYWdvclxcXFxkcnVuYWdvcl9hcHBfZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGxlYW5kXFxcXE9uZURyaXZlXFxcXERvY3VtZW50b3NcXFxcUHJvamV0b3NcXFxcQXBwRHJ1bmFnb3JcXFxcZHJ1bmFnb3JfYXBwX2Zyb250XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbGVhbmQvT25lRHJpdmUvRG9jdW1lbnRvcy9Qcm9qZXRvcy9BcHBEcnVuYWdvci9kcnVuYWdvcl9hcHBfZnJvbnQvdml0ZS5jb25maWcubXRzXCI7Ly8gUGx1Z2luc1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgRm9udHMgZnJvbSAndW5wbHVnaW4tZm9udHMvdml0ZSdcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcbmltcG9ydCBWdWV0aWZ5LCB7IHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCBWaXRlWWFtbCBmcm9tIFwiQG1vZHlmaS92aXRlLXBsdWdpbi15YW1sXCI7XG5pbXBvcnQgeyBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBWdWVSb3V0ZXIoe1xuICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyxcbiAgICB9KSxcbiAgICBWaXRlWWFtbCgpLFxuICAgIExheW91dHMoKSxcbiAgICBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICB7XG4gICAgICAgICAgJ3Z1ZS1yb3V0ZXIvYXV0byc6IFsndXNlUm91dGUnLCAndXNlUm91dGVyJ10sXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGR0czogJ3NyYy9jb21wb25lbnRzLmQudHMnLFxuICAgIH0pLFxuICAgIFZ1ZSh7XG4gICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSxcbiAgICB9KSxcbiAgICB2dWVEZXZUb29scygpLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS1sb2FkZXIvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdml0ZS1wbHVnaW4jcmVhZG1lXG4gICAgVnVldGlmeSh7XG4gICAgICBhdXRvSW1wb3J0OiB0cnVlLFxuICAgICAgc3R5bGVzOiB7XG4gICAgICAgIGNvbmZpZ0ZpbGU6ICdzcmMvc3R5bGVzL3NldHRpbmdzLnNjc3MnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBGb250cyh7XG4gICAgICBnb29nbGU6IHtcbiAgICAgICAgZmFtaWxpZXM6IFsge1xuICAgICAgICAgIG5hbWU6ICdSb2JvdG8nLFxuICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbWFuaWZlc3Q6IHRydWUsIC8vIEdlbmVyYXRlcyBhIG1hbmlmZXN0IGZpbGUgZm9yIGFkdmFuY2VkIGNhY2hpbmdcbiAgICBvdXREaXI6ICdkaXN0JywgLy8gRGVmYXVsdCBvdXRwdXQgZGlyZWN0b3J5XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5bZXh0XScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZTogeyAncHJvY2Vzcy5lbnYnOiB7fSB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gICAgZXh0ZW5zaW9uczogW1xuICAgICAgJy5qcycsXG4gICAgICAnLmpzb24nLFxuICAgICAgJy5qc3gnLFxuICAgICAgJy5tanMnLFxuICAgICAgJy50cycsXG4gICAgICAnLnRzeCcsXG4gICAgICAnLnZ1ZScsXG4gICAgXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1wiQC9sb2NhbGVzLyoqLyoueWFtbFwiXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBtYW5pZmVzdDogdHJ1ZSwgLy8gR2VuZXJhdGVzIGEgbWFuaWZlc3QgZmlsZSBmb3IgYWR2YW5jZWQgY2FjaGluZ1xuICAgIG91dERpcjogJ2Rpc3QnLCAvLyBEZWZhdWx0IG91dHB1dCBkaXJlY3RvcnlcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLltleHRdJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sV0FBVywwQkFBMEI7QUFDNUMsT0FBTyxpQkFBaUI7QUFHeEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlLFdBQVc7QUFDbkMsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsOEJBQThCO0FBZHFPLElBQU0sMkNBQTJDO0FBaUI3VCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsTUFDUixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUix1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUEsTUFDVCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxVQUNFLG1CQUFtQixDQUFDLFlBQVksV0FBVztBQUFBLFFBQzdDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxZQUFZO0FBQUE7QUFBQSxJQUVaLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDSixRQUFRO0FBQUEsUUFDTixVQUFVLENBQUU7QUFBQSxVQUNWLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxRQUNWLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsVUFBVTtBQUFBO0FBQUEsSUFDVixRQUFRO0FBQUE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsRUFBRSxlQUFlLENBQUMsRUFBRTtBQUFBLEVBQzVCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMscUJBQXFCO0FBQUEsRUFDakM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFVBQVU7QUFBQTtBQUFBLElBQ1YsUUFBUTtBQUFBO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
