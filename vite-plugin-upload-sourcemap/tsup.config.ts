import { defineConfig } from "tsup";

/**
 * Tsup 配置：用于打包 Vite 插件
 * 
 * 打包目标：生成支持 ESM 和 CommonJS 的通用插件包
 */
export default defineConfig({
  // 入口文件：插件的主入口
  entry: ["src/index.ts"],
  
  // 输出格式：同时支持 ESM 和 CommonJS
  // - esm: 现代模块标准，Vite 原生支持
  // - cjs: 传统模块格式，兼容旧项目
  format: ["esm", "cjs"],
  
  // 生成 TypeScript 类型声明文件（.d.ts）
  // 这样用户在使用时可以获得完整的类型提示
  dts: true,
  
  // 构建前清空 dist 目录
  // 确保每次构建都是干净的
  clean: true,
  
  // 生成 sourcemap 文件，方便调试
  sourcemap: true,
  
  // 外部依赖：这些依赖不会被打包进来
  // 用户需要在自己的项目中安装这些依赖
  external: [
    "vite",           // Vite 核心（由用户项目提供）
    "fs",             // Node.js 内置模块
    "path",           // Node.js 内置模块
  ],
  
  // 开启 Tree Shaking：自动移除未使用的代码
  treeshake: true,
  
  // 不拆分代码：生成单个文件
  // 插件通常不需要代码拆分
  splitting: false,
  
  // 不压缩代码：保持可读性
  // npm 包的压缩由使用者的构建工具处理
  minify: false,
  
  // 目标环境：Node.js 18+
  // 因为 Vite 插件运行在 Node.js 环境
  target: "node18",
  
  // 输出平台：Node.js
  platform: "node",
  
  // 不处理 shebang（#!）
  // Vite 插件不需要 shebang
  shims: false,
});
