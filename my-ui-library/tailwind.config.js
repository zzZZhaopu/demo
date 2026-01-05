/** @type {import('tailwindcss').Config} */
// Tailwind CSS 配置：定义样式扫描路径和主题定制
export default {
  // content: 指定需要扫描的文件，Tailwind 会提取这些文件中使用的类名
  content: [
    "./packages/*/src/**/*.{js,ts,jsx,tsx,vue}",  // 组件库源码
    "./examples/*/src/**/*.{js,ts,jsx,tsx,vue}"   // 示例项目
  ],
  // theme: 主题配置，可以自定义颜色、字体、间距等
  theme: {
    extend: {}  // 扩展默认主题（不覆盖）
  },
  // plugins: Tailwind 插件，可以添加自定义功能
  plugins: []
}
