import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import stylelintPlugin from "vite-plugin-stylelint";
import { VitePWA } from "vite-plugin-pwa";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Legacy from "@vitejs/plugin-legacy";
// import { uploadSourceMapPlugin } from "./plugins/vite-plugin-upload-sourcemap";
// import { uploadSourceMapPlugin } from "@zzzzzzhaopu/vite-plugin-upload-sourcemap";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  console.log(
    "process.env.SENTRY_AUTH_TOKEN=====",
    process.env.VITE_SENTRY_AUTH_TOKEN
  );

  // 转换环境变量为布尔值
  const sourcemap = env.VITE_BUILD_SOURCEMAP === "true";
  const dropConsole = env.VITE_DROP_CONSOLE === "true";

  return {
    plugins: [
      vue(),
      viteCompression(),
      // Stylelint 插件：检查和自动修复 CSS/SCSS 样式代码规范
      stylelintPlugin({ fix: true }),
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      AutoImport({
        dts: true,
        imports: ["vue", "vue-router"],
        resolvers: [ElementPlusResolver()],
      }),
      // 自动导入 Element Plus 组件
      Components({
        resolvers: [
          ElementPlusResolver({
            // 关键配置: 自动导入样式
            importStyle: false,
          }),
        ],
      }),
      // PWA 插件：支持渐进式 Web 应用，可离线访问、添加到主屏幕等，需要支持移动端可使用该插件
      VitePWA({
        registerType: "autoUpdate", // Service Worker 自动更新模式
        selfDestroying: true, // 当移除 PWA 功能时自动清理 Service Worker
      }),
      Legacy({
        targets: ["defaults", "ie >= 11"],
      }),
      // SourceMap 上传插件：生产环境打包后自动上传 SourceMap 到监控平台
      // uploadSourceMapPlugin({
      //   enabled: mode === "production", // 仅在生产环境启用
      //   uploadUrl: env.VITE_SOURCEMAP_UPLOAD_URL,
      //   apiKey: env.VITE_SOURCEMAP_API_KEY,
      //   projectName: "vue3-demo",
      //   version: process.env.npm_package_version || "1.0.0",
      //   removeSourceMap: true, // 上传后自动删除 .map 文件
      //   uploadFn: (_file, _options) => {
      //     console.log("options=====", _options);
      //     return new Promise((resolve, _reject) => {
      //       resolve(true);
      //     });
      //   },
      // }),
      sentryVitePlugin({
        org: "zzz-wjc",
        project: "javascript-vue",
        authToken:
          "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",
        sourcemaps: {
          filesToDeleteAfterUpload: ["./dist/**/*.map"],
        },
      }),
    ],
    // 开发服务器配置
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
      // 文件扩展名自动补全：导入模块时可以省略这些后缀名
      // 例：import App from './App' 会自动查找 App.vue、App.ts、App.js 等文件
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // 构建配置
    build: {
      // 根据环境变量决定是否生成 SourceMap
      sourcemap,
      // 压缩工具：根据环境自动选择
      // 开发/测试环境: esbuild (快速，适合频繁打包)
      // 生产环境: terser (压缩率高，适合正式发布)
      minify: process.env.NODE_ENV === "production" ? "terser" : "esbuild",
      // Chunk 体积警告阈值（KB）：当单个 chunk 超过 1500KB 时会提示警告
      chunkSizeWarningLimit: 1500,
      outDir: "dist", // 输出目录
      assetsDir: "static", // 静态资源目录(相对于 outDir)
      // Terser 配置（仅当 minify: "terser" 时生效）
      terserOptions: {
        compress: {
          // 根据环境变量决定是否移除 console
          drop_console: dropConsole,
          drop_debugger: true, // 移除 debugger
        },
        // 保留类名：防止类名被混淆，避免反射等功能失效
        keep_classnames: true,
      },
      rollupOptions: {
        output: {
          // 分离 JS 文件 - 简单平铺结构，便于缓存和部署
          chunkFileNames: "js/[name]-[hash].js",
          // 入口文件命名
          entryFileNames: "js/[name]-[hash].js",
          // 手动分包配置
          // 手动分包配置 - 按照更新频率和体积分组
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              // Vue 生态：核心库，几乎不更新
              if (id.includes("vue") || id.includes("@vue")) {
                return "vue-core";
              }

              // Vue Router：单独分包
              if (id.includes("vue-router")) {
                return "vue-router";
              }

              // Element Plus：体积大，单独分包
              if (id.includes("element-plus")) {
                return "element-plus";
              }

              // 工具库：合并到一起
              if (
                id.includes("lodash") ||
                id.includes("dayjs") ||
                id.includes("axios")
              ) {
                return "utils";
              }

              // 其他小型第三方库：合并到 vendor
              return "vendor";
            }
          },
        },
      },
    },
  };
});
