import { defineConfig } from "tsup";
import vue from "unplugin-vue/esbuild";

// Tsup 配置：用于打包 Vue 组件库
export default defineConfig({
  // 入口文件配置
  entry: {
    // 主入口：全量导出所有组件
    index: "src/index.ts"
  },
  // 输出格式：ESM（ES Module，现代标准）
  format: ["esm"],
  // Vue SFC 类型生成较复杂，暂时关闭，使用手动类型声明
  dts: false,
  // 构建前清空 dist 目录
  clean: true,
  // 生成 sourcemap 文件，方便调试
  sourcemap: true,
  // 外部依赖：不打包这些依赖，由使用者提供
  external: ["vue"],
  // 开启 Tree Shaking：移除未使用的代码
  treeshake: true,
  // 不拆分代码：每个入口生成一个文件
  splitting: false,
  // 不压缩代码：保持可读性，压缩由使用者的构建工具处理
  minify: false,
  // esbuild 插件配置
  esbuildPlugins: [
    vue({})  // Vue SFC 编译插件
  ]
});
