import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    
    // 生成 TypeScript 类型定义
    dts({
      include: ['packages/**/*'],
      exclude: ['src/**/*', 'node_modules'],
      outDir: 'dist/es',
      insertTypesEntry: true,
      copyDtsFiles: true,
      staticImport: true
    }),
    
    // SVG 作为 Vue 组件导入
    svgLoader({
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false
              }
            }
          }
        ]
      }
    })
  ],
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  
  // 路径解析
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages')
    }
  },
  
  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        // 全局引入变量和混入
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    }
  },
  
  // 构建配置（核心）
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'packages/index.ts'),
      // 库名称（UMD 格式使用）
      name: 'MyUILibrary',
      // 输出文件名
      fileName: (format) => `index.${format}.js`
    },
    
    rollupOptions: {
      // 外部依赖（不打包进组件库）
      external: [
        'vue',
        'element-plus',
        /^element-plus\/.*/
      ],
      
      output: [
        {
          // ES 模块格式
          format: 'es',
          // 保留模块结构（重要：支持按需引入）
          preserveModules: true,
          preserveModulesRoot: 'packages',
          // 输出目录
          dir: 'dist/es',
          // 导出模式
          exports: 'named',
          // 入口文件名
          entryFileNames: '[name].js',
          // 静态资源命名
          assetFileNames: (assetInfo) => {
            // CSS 文件 - 保持原有目录结构，方便按需引入
            if (assetInfo.name?.endsWith('.css')) {
              // 从源文件路径中提取组件路径
              const cssFileName = assetInfo.name.replace('.css', '')
              return `${cssFileName}.css`
            }
            // 图片资源
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash][extname]'
            }
            // 字体资源
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
        },
        {
          // UMD 格式
          format: 'umd',
          name: 'MyUILibrary',
          dir: 'dist/umd',
          exports: 'named',
          // 全局变量名（UMD 格式）
          globals: {
            vue: 'Vue',
            'element-plus': 'ElementPlus'
          },
          entryFileNames: 'index.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'style.css'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      ]
    },
    
    // 输出目录
    outDir: 'dist',
    
    // 清空输出目录
    emptyOutDir: true,
    
    // CSS 代码分割
    cssCodeSplit: true,
    
    // 压缩配置
    minify: 'esbuild',
    
    // 静态资源内联阈值（小于此值转 base64）
    assetsInlineLimit: 4096, // 4KB
    
    // Source Map
    sourcemap: false,
    
    // 目标环境
    target: 'es2015',
    
    // 库模式不需要 polyfill
    cssTarget: 'chrome61'
  }
})
