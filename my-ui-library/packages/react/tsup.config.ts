import { defineConfig } from "tsup";

// Tsup 配置：用于打包 React 组件库
export default defineConfig({
  // 入口文件配置
  entry: {
    // 主入口：全量导出所有组件
    index: "src/index.ts"
  },
  // 输出格式：ESM（ES Module，现代标准）
  format: ["esm"],
  // 生成 TypeScript 类型声明文件（.d.ts）
  dts: true,
  // 构建前清空 dist 目录
  clean: true,
  // 生成 sourcemap 文件，方便调试
  sourcemap: true,
  // 外部依赖：不打包这些依赖，由使用者提供
  external: ["react", "react-dom"],
  // 开启 Tree Shaking：移除未使用的代码
  treeshake: true,
  // 不拆分代码：每个入口生成一个文件
  splitting: false,
  // 不压缩代码：保持可读性，压缩由使用者的构建工具处理
  minify: false,
  // esbuild 选项配置
  esbuildOptions(options) {
    // 为 React 组件添加 "use client" 标记（Next.js 13+ App Router 需要）
    options.banner = {
      js: '"use client";'
    };
  }
});
