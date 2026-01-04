import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // 本地开发配置：支持 npm link 的组件库热更新
  server: {
    fs: {
      // 允许从父级目录访问文件（npm link 的组件库）
      allow: ['..'],
    },
  },
  
  optimizeDeps: {
    // 排除需要热更新的本地组件库
    exclude: ['@demo/my-ui'],
  },
})
